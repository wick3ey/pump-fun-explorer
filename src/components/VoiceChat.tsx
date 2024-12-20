import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AgoraRTC, { IAgoraRTCRemoteUser, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

interface VoiceChatProps {
  tokenSymbol: string;
}

type Participant = {
  id: string | number;
  name: string;
  speaking: boolean;
}

export const VoiceChat = ({ tokenSymbol }: VoiceChatProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [client, setClient] = useState<ReturnType<typeof AgoraRTC.createClient> | null>(null);
  const [audioTrack, setAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const { toast } = useToast();

  const appId = ""; // You'll need to add your Agora App ID

  const handleJoinVoice = async () => {
    if (!client) {
      toast({
        title: "Error",
        description: "Voice chat client not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      const track = await AgoraRTC.createMicrophoneAudioTrack();
      setAudioTrack(track);

      const uid = await client.join(appId, tokenSymbol, null);
      
      await client.publish(track);

      setParticipants(prev => [...prev, { 
        id: uid, 
        name: `User#${uid}`, 
        speaking: false 
      }]);

      client.on("user-joined", (user: IAgoraRTCRemoteUser) => {
        setParticipants(prev => [...prev, { 
          id: user.uid, 
          name: `User#${user.uid}`, 
          speaking: false 
        }]);
        toast({
          title: "User joined",
          description: `User#${user.uid} joined the voice chat`,
        });
      });

      client.on("user-left", (user: IAgoraRTCRemoteUser) => {
        setParticipants(prev => prev.filter(p => p.id !== user.uid));
        toast({
          title: "User left",
          description: `User#${user.uid} left the voice chat`,
        });
      });

      toast({
        title: "Joined voice chat",
        description: "You've joined the voice chat room",
      });
    } catch (error) {
      toast({
        title: "Error joining voice chat",
        description: error instanceof Error ? error.message : "Failed to join voice chat",
        variant: "destructive"
      });
    }
  };

  const handleMuteToggle = async () => {
    if (audioTrack) {
      if (isMuted) {
        await audioTrack.setEnabled(true);
      } else {
        await audioTrack.setEnabled(false);
      }
      setIsMuted(!isMuted);
      toast({
        title: isMuted ? "Unmuted" : "Muted",
        description: `You've ${isMuted ? 'unmuted' : 'muted'} your microphone`,
      });
    }
  };

  return (
    <Card className="bg-[#1A1F2C] border-[#2A2F3C] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Voice Chat - {tokenSymbol}</h3>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">{participants.length}</span>
          </div>
        </div>

        <div className="space-y-2">
          {participants.map((participant) => (
            <div 
              key={participant.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#2A2F3C]"
            >
              <span className="text-white">{participant.name}</span>
              {participant.speaking && (
                <span className="text-xs text-green-400">Speaking...</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            className="bg-[#2A2F3C] text-white hover:bg-[#3A3F4C]"
            onClick={handleJoinVoice}
          >
            Join Voice
          </Button>
          <Button
            variant="outline"
            className={`${
              isMuted 
                ? 'bg-[#2A2F3C] text-white hover:bg-[#3A3F4C]' 
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
            onClick={handleMuteToggle}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};