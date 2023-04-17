import { Button } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import {
  ConnectionNode,
  getPartDef,
  ImportableSource,
  isVisualPart,
  PartDefRepo,
  VisualPart,
} from "@flyde/core";
import React, { MouseEvent, MutableRefObject, useCallback } from "react";
import { useDependenciesContext } from "../../flow-editor/DependenciesContext";
import { usePorts } from "../../flow-editor/ports";
import { useHotkeys } from "../../lib/react-utils/use-hotkeys";
import { useLocalStorage } from "../../lib/user-preferences";

import { AppToaster, toastMsg } from "../../toaster";
import { AddPartMenu } from "./AddPartMenu";
import {
  addPartIcon,
  groupIcon,
  inspectIcon,
  pencilIcon,
  playIcon,
  removePartIcon,
  ungroupIcon,
} from "./icons/icons";
import { RunFlowModal } from "./RunFlowModal";

export enum ActionType {
  AddPart = "add-part",
  RemovePart = "remove-part",
  Group = "group",
  UnGroup = "un-group",
  AddInlineValue = "add-inline-value",
  Inspect = "inspect",
  Run = "run",
}

export type ActionData = {
  [ActionType.AddPart]: { importablePart: ImportableSource };
};

export type BaseAction<T extends ActionType> = {
  type: T;
} & (T extends keyof ActionData ? { data: ActionData[T] } : {});

export type Action<T extends ActionType = ActionType> = {
  [actionType in ActionType]: BaseAction<actionType>;
}[T];

export interface ActionsMenuProps {
  selectedInstances: string[];
  repo: PartDefRepo;
  part: VisualPart;
  from?: ConnectionNode;
  to?: ConnectionNode;
  hotkeysEnabled: MutableRefObject<boolean>;

  showRunFlowOptions: boolean;

  onAction: (action: Action) => void;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = (props) => {
  const {
    onAction,
    selectedInstances,
    repo,
    part,
    from,
    to,
    hotkeysEnabled,
    showRunFlowOptions,
  } = props;

  const { onRequestImportables } = useDependenciesContext();

  const [showAddPartMenu, setShowAddPartMenu] = React.useState(false);
  const [showRunFlowModal, setShowRunFlowModal] = React.useState(false);

  const [hideHotkeyHintMap, setHideHotkeyHintMap] = useLocalStorage(
    "hideHotkeyHintMap",
    {}
  );

  const closeAddPartMenu = useCallback(() => {
    setShowAddPartMenu(false);
  }, []);

  const { onRunFlow } = usePorts();

  const _runFlow = useCallback<typeof onRunFlow>(
    (inputs) => {
      setShowRunFlowModal(false);
      return onRunFlow(inputs);
    },
    [onRunFlow]
  );

  const types: ActionType[] = [];

  types.push(ActionType.AddPart);
  types.push(ActionType.AddInlineValue);

  if (selectedInstances.length === 1) {
    const instance = part.instances.find(
      (ins) => ins.id === selectedInstances[0]
    );
    if (!instance) {
      console.error(`Could not find instance with id ${selectedInstances[0]}`);
    } else {
      try {
        const part = getPartDef(instance, repo);
        if (isVisualPart(part)) {
          types.push(ActionType.UnGroup);
        }
      } catch (e) {
        console.error(
          `Could not find part with id ${selectedInstances[0]} - ${e}`
        );
      }
    }
  }

  if (showRunFlowOptions) {
    types.push(ActionType.Run);
  }

  if (selectedInstances.length > 0) {
    types.push(ActionType.Group);
  }

  if (selectedInstances.length === 1 || from || to) {
    types.push(ActionType.Inspect);
  }

  if (selectedInstances.length > 0) {
    types.push(ActionType.RemovePart);
  }

  const onDismissHotkeyHint = useCallback(
    (hotkey: string, toastId: string) => {
      setHideHotkeyHintMap({ ...hideHotkeyHintMap, [hotkey]: true });
      AppToaster.dismiss(toastId);
    },
    [hideHotkeyHintMap, setHideHotkeyHintMap]
  );

  const internalOnAction = useCallback(
    (type: ActionType, e: MouseEvent | KeyboardEvent) => {
      const { hotkey } = actionsMetaData[type];
      if (e.type === "click" && hotkey && !hideHotkeyHintMap[hotkey]) {
        const toastId = toastMsg(
          <>
            Did you know? you can also use the hotkey{" "}
            <kbd className="hotkey">{hotkey}</kbd> to{" "}
            {actionsMetaData[type].text.replace(/^[A-Z]/, (c) =>
              c.toLowerCase()
            )}
            <Button
              minimal
              small
              onClick={() => onDismissHotkeyHint(hotkey, toastId)}
            >
              {" "}
              Don't show again{" "}
            </Button>
          </>,
          "none",
          3000
        );
      }

      switch (type) {
        case ActionType.AddPart:
          setShowAddPartMenu(true);
          break;
        case ActionType.Run:
          void (async function () {
            if (Object.keys(part.inputs).length > 0) {
              setShowRunFlowModal(true);
            } else {
              onRunFlow({});
            }
          })();
          break;
        default:
          onAction({ type, data: undefined });
      }
    },
    [hideHotkeyHintMap, onAction, onDismissHotkeyHint, onRunFlow, part.inputs]
  );

  Object.entries(actionsMetaData).forEach(
    ([action, data]: [ActionType, typeof actionsMetaData[ActionType]]) => {
      if (data.hotkey) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useHotkeys(
          data.hotkey,
          (e) => {
            e.preventDefault();
            if (types.includes(action)) {
              internalOnAction(action, e as any);
              setHideHotkeyHintMap({
                ...hideHotkeyHintMap,
                [data.hotkey]: true,
              });
            }
          },
          { text: data.text, group: "Action menu hotkeys" },
          [types],
          hotkeysEnabled
        );
      }
    }
  );

  const onAddPart = useCallback(
    (importablePart: ImportableSource) => {
      onAction({ type: ActionType.AddPart, data: { importablePart } });
    },
    [onAction]
  );

  return (
    <div className="actions-menu">
      {types.map((type) => (
        <ActionButton key={type} type={type} onClick={internalOnAction} />
      ))}
      {showAddPartMenu ? (
        <AddPartMenu
          onRequestImportables={onRequestImportables}
          onAddPart={onAddPart}
          onClose={closeAddPartMenu}
        />
      ) : null}
      {showRunFlowModal ? (
        <RunFlowModal
          onClose={() => setShowRunFlowModal(false)}
          onRun={_runFlow}
          part={part}
        />
      ) : null}
    </div>
  );
};

export interface ActionButtonProps {
  onClick: (type: ActionType, e: MouseEvent) => void;
  type: ActionType;
}

const actionsMetaData: Record<
  ActionType,
  { icon: string; text: string; hotkey?: string }
> = {
  [ActionType.AddPart]: {
    icon: addPartIcon,
    text: 'Open the "add part" menu',
    hotkey: "a",
  },
  [ActionType.RemovePart]: {
    icon: removePartIcon,
    text: `Remove selected instances`,
    hotkey: "backspace",
  },
  [ActionType.Group]: {
    icon: groupIcon,
    text: "Group selection into a new part",
    hotkey: "g",
  },
  [ActionType.UnGroup]: {
    icon: ungroupIcon,
    text: "Ungroup selected visual part",
  },
  [ActionType.Inspect]: {
    icon: inspectIcon,
    text: "Inspect data",
    hotkey: "i",
  },
  [ActionType.AddInlineValue]: {
    icon: pencilIcon,
    text: "Add value / inline function",
    hotkey: "v",
  },
  [ActionType.Run]: {
    icon: playIcon,
    text: "Run flow",
    hotkey: "r",
  },
};

const emptyMeta = { icon: "", text: "N/A", hotkey: undefined };

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { onClick, type } = props;
  const _onClick = useCallback(
    (e: MouseEvent) => onClick(type, e),
    [onClick, type]
  );
  const metaData = actionsMetaData[type] ?? emptyMeta;

  const text = metaData.hotkey ? (
    <span>
      {metaData.text} <kbd className="hotkey">{metaData.hotkey}</kbd>
    </span>
  ) : (
    metaData.text
  );
  return (
    <div className="action-button" onClick={_onClick}>
      <Tooltip2
        hoverOpenDelay={100}
        content={text}
        className="icon-wrapper"
        popoverClassName="action-button-tooltip"
      >
        <span dangerouslySetInnerHTML={{ __html: metaData.icon }} />
      </Tooltip2>
    </div>
  );
};