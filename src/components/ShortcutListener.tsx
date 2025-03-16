import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import {triggerAction} from "../redux/menuSlice.ts";
import {RootState} from "../redux/store.ts";

const ShortcutListener: React.FC = () => {
  const dispatch = useDispatch();
  // const actions = useSelector((state: RootState) => state.action.actions);

  const handleKeyPress = (e: KeyboardEvent) => {
    // const pressedShortcut = `${e.ctrlKey ? 'Ctrl+' : ''}${e.key}`;
    /*   const actionToTrigger = actions.find(
         (action: any) => action.shortcut === pressedShortcut && !action.disabled
       );*/
    // console.log(actions)
    // flattenedToNested(actions)
    /*if (actionToTrigger) {
      // Dispatch the action to the Redux store
      console.log(actionToTrigger.id)
      dispatch(triggerAction(actionToTrigger.id));
    }*/
  };

  useEffect(() => {
    // Add keydown event listener to watch for keyboard shortcuts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null; // No UI, just functionality
};


export default ShortcutListener;