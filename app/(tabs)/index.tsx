import { AppText } from '@/components/AppText';
import { SectionHeader } from '@/components/SectionHeader'; // Your existing component
import { recentPlays } from '@/src/data/recentPlays';
import { colors } from '@/src/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-screens';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Recommendation');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Recommendation', 'Trending', 'Beauty', 'Business'];

  const partyCards = [
    { id: 1, title: 'Friday Party', subtitle: 'Party mood !', image: require('@/assets/images/party-card1.png') },
    { id: 2, title: 'Saturday Party', subtitle: 'Party mood !', image: require('@/assets/images/party-card2.png') },
  ];

  const filteredRecentPlays = recentPlays.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="body" style={styles.ptext}>Hello Vini,</AppText>
        <AppText variant="caption" style={styles.ptext}>
          What You want to hear today ?
        </AppText>
      </View>
<SearchBar/>
      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <MaterialIcons name="keyboard-voice" size={20} color={colors.text.tertiary} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tabItem}
                activeOpacity={0.8}
              >
                <AppText
                  variant="caption"
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                >
                  {tab}
                </AppText>
                {isActive && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Party Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {partyCards.map(card => (
            <View key={card.id} style={styles.partyCard}>
              <Image source={card.image} style={styles.partyImage} />
              <TouchableOpacity style={styles.playBtn}>
                <MaterialIcons name="play-arrow" size={15} color="#ffff" />
              </TouchableOpacity>
              <View style={styles.partyText}>
                <AppText variant="caption" style={styles.partyTitle}>
                  {card.title}
                </AppText>
                <AppText variant="caption" style={styles.subtitle}>{card.subtitle}</AppText>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Recently Played - USING YOUR SECTIONHEADER */}
        <SectionHeader 
          title="Recently Play"
          actionText="See all"
        />

        {/* Recently Played List */}
        {filteredRecentPlays.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.recentItem}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: '/playingsong',
                params: { id: item.id.toString() },
              })
            }
          >
            <Image source={item.image} style={styles.recentImage} />

            <View style={{ flex: 1 }}>
              <AppText variant="body" style={styles.recenttext}>{item.title}</AppText>
              <AppText variant="caption" style={styles.recenttext}>{item.artist}</AppText>
              <AppText variant="caption" style={styles.time}>{item.time}</AppText>
            </View>

            <View style={styles.playCircle}>
              <MaterialIcons name="play-arrow" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
  },
  ptext: {
    color: colors.text.primary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.text.tertiary,
    marginHorizontal: 6,
  },

  tabs: {
  flexDirection: 'row',
  paddingHorizontal: 20,
  marginBottom: 16,
},

tabItem: {
  marginRight: 22,
  alignItems: 'center',
},

tabText: {
  color: colors.text.tertiary,
},

activeTabText: {
  color: colors.primary,
  fontWeight: '500',
},

tabUnderline: {
  marginTop: 4,          
  height: 2,
  width: '60%',         // underline exactly text width
  backgroundColor: colors.primary,
  borderRadius: 2,
},


  partyCard: {
    width: 150,
    height: 160,
    marginLeft: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  partyImage: {
    width: '100%',
    height: '100%',
  },
  playBtn: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    backgroundColor: colors.primary,
    width: 17,
    height: 17,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  partyTitle: {
    color:colors.text.primary,
  },
  subtitle:{
 color:colors.text.primary,

  }
,
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
recenttext:{
  color:colors.text.primary,
},
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    marginLeft:20,
    marginRight:20,
    backgroundColor: '#4E4E54',
    borderRadius: 10,
    padding: 10,
  },
  recentImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  time: {
    marginTop: 2,
      color:colors.text.primary,

  },
  playCircle: {
    backgroundColor: colors.primary,
    width: 25,
    height: 25,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

