import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Search, MessageCircle, Phone, Video, MoveHorizontal as MoreHorizontal, Send, Package, Building, Truck } from 'lucide-react-native';
import { useUserRole } from '@/hooks/useUserRole';

interface Conversation {
  id: string;
  participantName: string;
  participantType: 'farmer' | 'buyer' | 'logistics';
  participantPhoto: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  cropName?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export default function MessagesScreen() {
  const { userRole } = useUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participantName: 'Global Foods International',
      participantType: 'buyer',
      participantPhoto: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'We are interested in your Basmati rice. Can we discuss pricing?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      isOnline: true,
      cropName: 'Basmati Rice'
    },
    {
      id: '2',
      participantName: 'Swift Cargo Solutions',
      participantType: 'logistics',
      participantPhoto: 'https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'We can handle the shipment to Europe. Let me send you a quote.',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      isOnline: false,
      cropName: 'Wheat'
    },
    {
      id: '3',
      participantName: 'Green Valley Organic Farm',
      participantType: 'farmer',
      participantPhoto: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Thank you for your interest. The harvest will be ready next month.',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      isOnline: true,
      cropName: 'Organic Cotton'
    }
  ];

  // Mock messages for selected conversation
  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: 'other',
      content: 'Hello! I saw your Basmati rice listing. Very impressive quality.',
      timestamp: '10:30 AM',
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Thank you! We take great pride in our organic farming methods.',
      timestamp: '10:32 AM',
      isRead: true
    },
    {
      id: '3',
      senderId: 'other',
      content: 'We are interested in purchasing 50 tons. Can we discuss pricing and delivery terms?',
      timestamp: '10:35 AM',
      isRead: true
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Absolutely! Our current price is $1200 per ton. We can arrange delivery through our logistics partners.',
      timestamp: '10:37 AM',
      isRead: true
    },
    {
      id: '5',
      senderId: 'other',
      content: 'That sounds reasonable. Do you have any certifications for organic farming?',
      timestamp: '10:40 AM',
      isRead: false
    }
  ];

  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.cropName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getParticipantIcon = (type: string) => {
    switch (type) {
      case 'farmer':
        return <Package color={Colors.primary[600]} size={16} />;
      case 'buyer':
        return <Building color={Colors.accent[600]} size={16} />;
      case 'logistics':
        return <Truck color={Colors.secondary[600]} size={16} />;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const renderConversationsList = () => (
    <View style={styles.conversationsContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Connect with your network</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={Colors.neutral[400]} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.neutral[400]}
          />
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageCircle color={Colors.neutral[400]} size={48} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Start connecting with farmers, buyers, and logistics partners
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={[
                styles.conversationItem,
                selectedConversation === conversation.id && styles.conversationItemSelected
              ]}
              onPress={() => setSelectedConversation(conversation.id)}
            >
              <View style={styles.conversationAvatar}>
                <Image source={{ uri: conversation.participantPhoto }} style={styles.avatarImage} />
                {conversation.isOnline && <View style={styles.onlineIndicator} />}
              </View>

              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <View style={styles.participantInfo}>
                    {getParticipantIcon(conversation.participantType)}
                    <Text style={styles.participantName}>{conversation.participantName}</Text>
                  </View>
                  <Text style={styles.messageTime}>{conversation.lastMessageTime}</Text>
                </View>

                {conversation.cropName && (
                  <Text style={styles.cropName}>Re: {conversation.cropName}</Text>
                )}

                <View style={styles.lastMessageRow}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderChatView = () => {
    const conversation = mockConversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;

    return (
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedConversation(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}>
              <Image source={{ uri: conversation.participantPhoto }} style={styles.chatAvatarImage} />
              {conversation.isOnline && <View style={styles.chatOnlineIndicator} />}
            </View>
            <View style={styles.chatParticipantInfo}>
              <View style={styles.chatParticipantName}>
                {getParticipantIcon(conversation.participantType)}
                <Text style={styles.chatParticipantText}>{conversation.participantName}</Text>
              </View>
              <Text style={styles.chatStatus}>
                {conversation.isOnline ? 'Online' : 'Last seen 2 hours ago'}
              </Text>
            </View>
          </View>

          <View style={styles.chatActions}>
            <TouchableOpacity style={styles.chatActionButton}>
              <Phone color={Colors.primary[600]} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionButton}>
              <Video color={Colors.primary[600]} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionButton}>
              <MoreHorizontal color={Colors.primary[600]} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {mockMessages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageItem,
                message.senderId === 'me' ? styles.myMessage : styles.otherMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.senderId === 'me' ? styles.myMessageText : styles.otherMessageText
              ]}>
                {message.content}
              </Text>
              <Text style={[
                styles.messageTime,
                message.senderId === 'me' ? styles.myMessageTime : styles.otherMessageTime
              ]}>
                {message.timestamp}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            placeholderTextColor={Colors.neutral[400]}
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send color={newMessage.trim() ? Colors.text.inverse : Colors.neutral[400]} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedConversation ? renderChatView() : renderConversationsList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  conversationsContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  conversationItemSelected: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
  },
  conversationAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success[500],
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cropName: {
    fontSize: 12,
    color: Colors.primary[600],
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary[600],
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: '500',
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatar: {
    position: 'relative',
  },
  chatAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success[500],
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  chatParticipantInfo: {
    flex: 1,
  },
  chatParticipantName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatParticipantText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  chatStatus: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary[600],
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: Colors.text.inverse,
  },
  otherMessageText: {
    color: Colors.text.primary,
  },
  myMessageTime: {
    color: Colors.primary[100],
  },
  otherMessageTime: {
    color: Colors.text.secondary,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    gap: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: Colors.background,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
});