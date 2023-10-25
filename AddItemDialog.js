import React, { useState } from 'react';
import { View, TextInput, Button, Modal } from 'react-native';

export default function AddItemDialog({ visible, onSave, onCancel }) {
  const [number, setNumber] = useState('');
  const [color, setColor] = useState('');
//commento per git
  const handleSave = () => {
    onSave({ number, color });
    setNumber('');
    setColor('');
  };

  return (
    <Modal visible={visible}>
      <View>
        <TextInput
          placeholder="Numero"
          value={number}
          onChangeText={(text) => setNumber(text)}
        />
        <TextInput
          placeholder="Colore"
          value={color}
          onChangeText={(text) => setColor(text)}
        />
        <Button title="Salva" onPress={handleSave} />
        <Button title="Annulla" onPress={onCancel} />
      </View>
    </Modal>
  );
}
