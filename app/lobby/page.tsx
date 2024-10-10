"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LogoutButton } from '@/components/logout-button';
import { auth } from '@/lib/firebase';

export default function Lobby() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [rooms, setRooms] = useState([
    { id: 1, name: '初心者の部屋', players: 2, maxPlayers: 5 },
    { id: 2, name: '上級者向け', players: 4, maxPlayers: 5 },
    { id: 3, name: 'みんなで冒険', players: 1, maxPlayers: 5 },
  ]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sender: auth.currentUser?.displayName || 'Anonymous' }]);
      setMessage('');
    }
  };

  const handleCreateRoom = () => {
    // TODO: Implement room creation logic
    console.log('Create new room');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ロビー</h1>
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>全体チャット</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-grow mr-2"
              />
              <Button type="submit">送信</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>部屋一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] mb-4">
              {rooms.map((room) => (
                <div key={room.id} className="mb-2 p-2 border rounded">
                  <div>{room.name}</div>
                  <div className="text-sm text-gray-500">
                    プレイヤー: {room.players}/{room.maxPlayers}
                  </div>
                  <Button size="sm" className="mt-2">
                    参加
                  </Button>
                </div>
              ))}
            </ScrollArea>
            <Button onClick={handleCreateRoom}>新しい部屋を作成</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}