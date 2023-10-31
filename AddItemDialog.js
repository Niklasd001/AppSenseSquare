import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Per le icone

export default function AddItemDialog({ visible, onSave, onCancel }) {
  const [number, setNumber] = useState('');
  const [color, setColor] = useState('');

  const handleSave = () => {
    onSave({ number, color });
    setNumber('');
    setColor('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.dialogContainer}>
        <View style={styles.dialogContent}>
          <TextInput
            style={styles.input}
            placeholder="Numero"
            value={number}
            onChangeText={(text) => setNumber(text)}
          />
          <Button title="Salva" onPress={handleSave} color="#34eb9b" />
          <Button title="Annulla" onPress={onCancel} color="#34eb9b" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  dialogContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
});
