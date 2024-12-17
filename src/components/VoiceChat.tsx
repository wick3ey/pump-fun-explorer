import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConversation } from '@11labs/react';

interface VoiceChatProps {
  tokenSymbol: string;
}

export const VoiceChat = ({ tokenSymbol }: VoiceChatProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [participants, setParticipants] = useState([
    { id: 1, name: "Anon#1234", speaking: false },
    { id: 2, name: "Degen#5678", speaking: true }
  ]);
  const { toast } = useToast();
  const conversation = useConversation();

  const handleJoinVoice = async () => {
    try {
      await conversation.startSession({
        agentId: "default_agent_id",
        overrides: {
          tts: {
            voiceId: "21m00Tcm4TlvDq8ikWAM"
          }
        }
      });
      toast({
        title: "Joined voice chat",
        description: "You've joined the voice chat room",
      });
    } catch (error) {
      toast({
        title: "Error joining voice chat",
        description: "Failed to join voice chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: `You've ${isMuted ? 'unmuted' : 'muted'} your microphone`,
    });
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