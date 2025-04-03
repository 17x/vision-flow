import {Cross, Group, Redo, Save, Trash, Undo, Ungroup, Lock, Unlock} from "lucide-react";

export const NamedIcon: React.FC<{ size: number, iconName: string }> = ({iconName, size}) => {
  switch (iconName) {
    case "save":
      return <Save size={size}/>;
    case "undo":
      return <Undo size={size}/>;
    case "redo":
      return <Redo size={size}/>;
    case "trash":
      return <Trash size={size}/>;
    case "cross":
      return <Cross size={size}/>;
    case "group":
      return <Group size={size}/>;
    case "ungroup":
      return <Ungroup size={size}/>;
    case "lock":
      return <Lock size={size}/>;
    case "unlock":
      return <Unlock size={size}/>;
    default:
      return null;
  }
};