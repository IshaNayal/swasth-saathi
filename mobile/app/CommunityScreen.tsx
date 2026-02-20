import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../hooks/useAppStore';

export default function CommunityScreen() {
    const { forumPosts, addForumPost, likePost } = useAppStore();
    const [newTitle, setNewTitle] = useState('');
    const [newBody, setNewBody] = useState('');
    const [anonymous, setAnonymous] = useState(true);
    const [showCompose, setShowCompose] = useState(false);

    const handlePost = () => {
        if (!newTitle.trim()) return Alert.alert('Error', 'Enter a title for your post');
        addForumPost({
            user: anonymous ? 'Anonymous' : 'You',
            title: newTitle,
            body: newBody,
            replies: 0,
            likes: 0,
            date: new Date().toISOString().split('T')[0],
            anonymous,
        });
        setNewTitle(''); setNewBody('');
        setShowCompose(false);
        Alert.alert('Posted! ✅', 'Your question has been shared with the community.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#A29BFE', '#6C63FF']} style={styles.header}>
                    <Text style={styles.title}>🌍 Community Health</Text>
                    <Text style={styles.subtitle}>Ask questions, share experiences</Text>
                </LinearGradient>

                {/* Compose */}
                {showCompose ? (
                    <View style={styles.composeCard}>
                        <TextInput style={styles.composeTitle} placeholder="Your health question..." value={newTitle} onChangeText={setNewTitle} />
                        <TextInput style={styles.composeBody} placeholder="Add details (optional)" value={newBody} onChangeText={setNewBody} multiline />
                        <TouchableOpacity style={styles.anonToggle} onPress={() => setAnonymous(!anonymous)}>
                            <Ionicons name={anonymous ? 'eye-off' : 'eye'} size={18} color="#6C63FF" />
                            <Text style={styles.anonText}>{anonymous ? 'Posting anonymously' : 'Posting as yourself'}</Text>
                        </TouchableOpacity>
                        <View style={styles.composeBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCompose(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
                                <Text style={styles.postText}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.newPostBtn} onPress={() => setShowCompose(true)}>
                        <Ionicons name="add-circle" size={22} color="#fff" />
                        <Text style={styles.newPostText}>Ask a Question</Text>
                    </TouchableOpacity>
                )}

                {/* Posts */}
                {forumPosts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyTitle}>No posts yet</Text>
                        <Text style={styles.emptySubtitle}>Be the first to ask a health question!</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>💬 {forumPosts.length} Questions</Text>
                        {forumPosts.map(post => (
                            <View key={post.id} style={styles.postCard}>
                                <View style={styles.postUser}>
                                    <Ionicons name={post.anonymous ? 'eye-off' : 'person-circle'} size={20} color="#636E72" />
                                    <Text style={styles.postUserName}>{post.user}</Text>
                                    <Text style={styles.postDate}>{post.date}</Text>
                                </View>
                                <Text style={styles.postTitle}>{post.title}</Text>
                                {post.body ? <Text style={styles.postBody}>{post.body}</Text> : null}
                                <View style={styles.postMeta}>
                                    <TouchableOpacity style={styles.metaItem} onPress={() => likePost(post.id)}>
                                        <Ionicons name="heart-outline" size={18} color="#FF4757" />
                                        <Text style={styles.metaText}>{post.likes}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="chatbubble-outline" size={18} color="#636E72" />
                                        <Text style={styles.metaText}>{post.replies} replies</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
    newPostBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C63FF', marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 18 },
    newPostText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    composeCard: { marginHorizontal: 20, marginTop: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
    composeTitle: { backgroundColor: '#F0F2F5', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12 },
    composeBody: { backgroundColor: '#F0F2F5', borderRadius: 12, padding: 16, fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
    anonToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    anonText: { marginLeft: 8, fontSize: 14, color: '#6C63FF' },
    composeBtns: { flexDirection: 'row' },
    cancelBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', marginRight: 8 },
    cancelText: { fontSize: 15, color: '#636E72' },
    postBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#6C63FF', alignItems: 'center', marginLeft: 8 },
    postText: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#636E72', marginTop: 15 },
    emptySubtitle: { fontSize: 14, color: '#999', marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3436', marginHorizontal: 20, marginTop: 25, marginBottom: 15 },
    postCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 18, marginBottom: 12, elevation: 2 },
    postUser: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    postUserName: { fontSize: 13, color: '#636E72', marginLeft: 8, flex: 1 },
    postDate: { fontSize: 12, color: '#999' },
    postTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', lineHeight: 22 },
    postBody: { fontSize: 14, color: '#636E72', marginTop: 6, lineHeight: 20 },
    postMeta: { flexDirection: 'row', marginTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 25 },
    metaText: { fontSize: 13, color: '#636E72', marginLeft: 6 },
});
