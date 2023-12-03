import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Per le icone

export default function AddItemDialog({ visible, onSave, onCancel }) {
  const [number, setNumber] = useState('');

  const handleSave = () => {
    onSave(number);
    setNumber('');
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
          <TouchableOpacity onPress={handleSave} style={styles.button}>
            <FontAwesome name="save" size={20} color="white" />
            <Text style={styles.buttonText}>Salva</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={styles.button}>
            <FontAwesome name="times" size={20} color="white" />
            <Text style={styles.buttonText}>Annulla</Text>
          </TouchableOpacity>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34eb9b',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
  },
});
