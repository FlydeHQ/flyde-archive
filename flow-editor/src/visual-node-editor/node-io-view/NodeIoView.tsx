import * as React from "react";
import { getOutputName, InputMode, noop, PinType, Pos } from "@flyde/core";
import { BaseNodeView } from "../base-node-view";
import classNames from "classnames";
import { Menu, MenuItem } from "@blueprintjs/core";
import { usePrompt } from "../../flow-editor/ports";
import { calcHistoryContent, useHistoryHelpers } from "../pin-view/helpers";
import { getInputName } from "@flyde/core";
import { useDarkMode } from "../../flow-editor/DarkModeContext";
import { PinView } from "../pin-view/PinView";
import { getMainPinDomId } from "../dom-ids";

export interface NodeIoViewProps {
  id: string;
  type: PinType;
  pos: Pos;
  currentInsId: string;
  ancestorInsIds: string;
  connected: boolean;
  dragged?: boolean;
  inputMode?: InputMode;
  closest: boolean;
  viewPort: { pos: Pos; zoom: number };
  onDblClick?: (pinId: string, e: React.MouseEvent) => void;
  onDelete?: (type: PinType, pin: string) => void;
  onRename?: (type: PinType, pin: string) => void;
  onChangeInputMode?: (pin: string, newMode: InputMode) => void;
  onChange?: (type: PinType, pin: string) => void;
  onDragEnd: (type: PinType, pin: string, ...data: any[]) => void;
  onDragStart: (pin: string, ...data: any[]) => void;
  onDragMove: (type: PinType, pin: string, ...data: any[]) => void;

  onMouseUp: (id: string, type: PinType, e: React.MouseEvent) => void;
  onMouseDown: (id: string, type: PinType, e: React.MouseEvent) => void;

  onSelect: (id: string, type: PinType) => void;
  selected: boolean;

  description: string;
  onSetDescription: (type: PinType, pin: string, description: string) => void;
}

export const NodeIoView: React.FC<NodeIoViewProps> = React.memo(
  function NodeIoViewInner(props) {
    const {
      viewPort,
      selected,
      type,
      id,
      onDblClick,
      onRename,
      onDelete,
      onChangeInputMode,
      inputMode,
      onSelect,
      closest,
      onSetDescription,
      description,
      onMouseUp,
      onMouseDown,
      currentInsId,
      onDragStart,
      onDragEnd,
      pos,
    } = props;

    const { history, resetHistory, refreshHistory } = useHistoryHelpers(
      currentInsId,
      id,
      type
    );

    const lastDragEndTimeRef = React.useRef<number>(0);

    const _onDragStart = React.useCallback(
      (event: any, data: any) => {
        onDragStart(id, event, data);
      },
      [id, onDragStart]
    );

    const _onDragEnd = React.useCallback(
      (event: any, data: any) => {
        const currPos = pos;
        const dx = (data.x - currPos.x) / viewPort.zoom;
        const dy = (data.y - currPos.y) / viewPort.zoom;
        const newX = currPos.x + dx;
        const newY = currPos.y + dy;

        const pixelsMoved = Math.abs(dx) + Math.abs(dy);

        onDragEnd(type, id, event, { ...data, x: newX, y: newY });
        if (pixelsMoved > 0) {
          lastDragEndTimeRef.current = Date.now();
        }
      },
      [pos, viewPort.zoom, onDragEnd, type, id]
    );

    const onDragMove = (event: any, data: any) => {
      props.onDragMove(type, id, event, { x: data.x, y: data.y });
    };

    const _prompt = usePrompt();

    const _onSetDescription = React.useCallback(async () => {
      const newDescription = await _prompt("Description?", description);
      onSetDescription(type, id, newDescription);
    }, [_prompt, description, onSetDescription, type, id]);

    const onDeleteInner = React.useCallback(() => {
      if (onDelete) {
        onDelete(type, id);
      }
    }, [type, id, onDelete]);

    const onRenameInner = React.useCallback(() => {
      if (onRename) {
        onRename(type, id);
      }
    }, [type, id, onRename]);

    const onChangeInputModeInner = React.useCallback(
      (mode: InputMode) => {
        if (onChangeInputMode) {
          onChangeInputMode(id, mode);
        }
      },
      [id, onChangeInputMode]
    );

    const contextMenuItems = React.useCallback(() => {
      return [
        { text: `Current mode - ${inputMode}`, onClick: noop },
        {
          text: "Make required",
          onClick: () => onChangeInputModeInner("required"),
        },
        {
          text: "Make optional",
          onClick: () => onChangeInputModeInner("optional"),
        },
        {
          text: "Make required-if-connected",
          onClick: () => onChangeInputModeInner("required-if-connected"),
        },
        {
          text: "Set description",
          onClick: _onSetDescription,
        },
        ...(props.onRename ? [{ text: "Rename", onClick: onRenameInner }] : []),
        ...(props.onDelete ? [{ text: "Delete", onClick: onDeleteInner }] : []),
      ];
    }, [
      _onSetDescription,
      inputMode,
      onChangeInputModeInner,
      onDeleteInner,
      onRenameInner,
      props.onDelete,
      props.onRename,
    ]);

    const onDblClickInner = React.useCallback(
      (e: any) => {
        if (onDblClick) {
          onDblClick(props.id, e);
        }
      },
      [onDblClick, props.id]
    );

    const _onClick = React.useCallback(() => {
      if (Date.now() - lastDragEndTimeRef.current > 200) {
        onSelect(id, type);
      }
    }, [id, type, onSelect]);

    const getContextMenu = React.useCallback(() => {
      return (
        <Menu>
          {contextMenuItems().map((item, key) => (
            <MenuItem {...item} key={key} />
          ))}
        </Menu>
      );
    }, [contextMenuItems]);

    const displayName = type === "input" ? getInputName(id) : getOutputName(id);

    const calcTooltipContent = () => {
      const historyContent = calcHistoryContent(history);

      const maybeDescription = props.description ? (
        <em>{props.description}</em>
      ) : (
        ""
      );

      return (
        <div>
          <div>
            <strong>{displayName}</strong> ({type}){" "}
          </div>
          {maybeDescription}
          <hr />
          {historyContent}
        </div>
      );
    };

    const _onMouseUp = React.useCallback(
      (e: React.MouseEvent) => {
        onMouseUp(id, type, e);
      },
      [id, onMouseUp, type]
    );

    const _onMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        onMouseDown(id, type, e);
      },
      [id, onMouseDown, type]
    );

    const dark = useDarkMode();

    const pinContent = (
      <div className={classNames("pin-container", type)}>
        {type === "input" ? (
          <PinView
            type="output"
            currentInsId={currentInsId}
            ancestorsInsIds={props.ancestorInsIds}
            id={id}
            connected={props.connected}
            isClosestToMouse={closest}
            selected={selected}
            onClick={(pinId, pinType) => onSelect(pinId, pinType)}
            onDoubleClick={(pinId, e) => onDblClick && onDblClick(pinId, e)}
            onToggleLogged={noop}
            onToggleBreakpoint={noop}
            onInspect={noop}
            description={description}
            onMouseUp={(pinId, pinType, e) => _onMouseUp(e)}
            onMouseDown={(pinId, pinType, e) => _onMouseDown(e)}
            isMain={true}
          />
        ) : (
          <PinView
            type="input"
            currentInsId={currentInsId}
            ancestorsInsIds={props.ancestorInsIds}
            id={id}
            connected={props.connected}
            isClosestToMouse={closest}
            selected={selected}
            onClick={(pinId, pinType) => onSelect(pinId, pinType)}
            onDoubleClick={(pinId, e) => onDblClick && onDblClick(pinId, e)}
            onToggleLogged={noop}
            onToggleBreakpoint={noop}
            onInspect={noop}
            description={description}
            onMouseUp={(pinId, pinType, e) => _onMouseUp(e)}
            onMouseDown={(pinId, pinType, e) => _onMouseDown(e)}
            onToggleSticky={noop}
            isSticky={false}
            queuedValues={0}
            isMain={true}
          />
        )}
      </div>
    );

    const domId = getMainPinDomId(currentInsId, id, type);
    return (
      <BaseNodeView
        className={classNames(`node-io-view`, type, { dark })}
        pos={pos}
        icon={type === "output" ? "paper-plane" : "arrow-right-long"}
        description={description ?? `Main ${type} pin - ${id}`}
        onDragEnd={_onDragEnd}
        onDragStart={_onDragStart}
        onDragMove={onDragMove}
        viewPort={viewPort}
        heading={displayName}
        leftSide={type === "output" ? pinContent : undefined}
        rightSide={type === "input" ? pinContent : undefined}
        contextMenuContent={getContextMenu()}
        onClick={_onClick}
        onDoubleClick={onDblClickInner}
        selected={selected}
        dark={dark}
        domId={domId}
      />
    );
  }
);
