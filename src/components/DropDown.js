import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDown = ({ data, open, setOpen, onOpen }) => {
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(data);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onOpen={onOpen}
      dropDownContainerStyle={{ top: 0, position: 'relative', height: 400 }}
    />
  );
};

export default DropDown;
