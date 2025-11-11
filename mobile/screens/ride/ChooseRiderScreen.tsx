import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming RootStackParamList is defined in '../../App'
type RootStackParamList = {
  Home: undefined; // Or the screen that navigates to this
  ChooseRider: undefined;
};

type ChooseRiderScreenProps = NativeStackScreenProps<RootStackParamList, 'ChooseRider'>;

const PRIMARY_COLOR = '#D4AF37';
const TEXT_COLOR_DARK = '#1C1C1C';
const TEXT_COLOR_GREY = '#6A6A6A';
const INPUT_BG_COLOR = '#F5F5F5';

// Dummy data for Device Contacts
const DUMMY_CONTACTS = [
  { id: '1', name: 'John Doe', phoneNumber: '+263 771 234 567' },
  { id: '2', name: 'Jane Smith', phoneNumber: '+263 771 234 568' },
  { id: '3', name: 'Michael Brown', phoneNumber: '+263 771 234 569' },
  { id: '4', name: 'Emily Davis', phoneNumber: '+263 771 234 570' },
  { id: '5', name: 'David Wilson', phoneNumber: '+263 771 234 571' },
  { id: '6', name: 'Sarah Miller', phoneNumber: '+263 771 234 572' },
  { id: '7', name: 'Chris Taylor', phoneNumber: '+263 771 234 573' },
  { id: '8', name: 'Olivia White', phoneNumber: '+263 771 234 574' },
];

const ChooseRiderScreen = ({ navigation }: ChooseRiderScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(DUMMY_CONTACTS);

  // Filter contacts based on search query
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = DUMMY_CONTACTS.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.phoneNumber.includes(text)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(DUMMY_CONTACTS);
    }
  };

  const renderContactItem = ({ item }: { item: typeof DUMMY_CONTACTS[0] }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Ionicons name="person-outline" size={24} color={TEXT_COLOR_DARK} style={styles.contactIcon} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Handle Bar for Bottom Sheet look */}
        <View style={styles.handleBar} />

        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={TEXT_COLOR_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose a rider</Text>
          <TouchableOpacity style={styles.addRiderButton}>
            <Ionicons name="person-add-outline" size={24} color={TEXT_COLOR_DARK} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={TEXT_COLOR_GREY} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or number"
            placeholderTextColor={TEXT_COLOR_GREY}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Device Contacts List */}
        <Text style={styles.listHeader}>Device Contacts</Text>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.flatListContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20, // Mimic bottom sheet
    borderTopRightRadius: 20, // Mimic bottom sheet
    paddingHorizontal: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  addRiderButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: TEXT_COLOR_DARK,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    marginBottom: 15,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  contactIcon: {
    width: 30, // Allocate space for icon
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_COLOR_DARK,
  },
  contactNumber: {
    fontSize: 13,
    color: TEXT_COLOR_GREY,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: INPUT_BG_COLOR,
    marginLeft: 45, // Align with text
  },
});

export default ChooseRiderScreen;