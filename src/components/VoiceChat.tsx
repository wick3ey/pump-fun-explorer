import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Users, Rocket, Flame, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useConversation } from '@11labs/react';

interface VoiceChatProps {
  tokenSymbol: string;
}

interface EmojiVote {
  rocket: number;
  fire: number;
  poop: number;
  flag: number;
}

export const VoiceChat = ({ tokenSymbol }: VoiceChatProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [votes, setVotes] = useState<EmojiVote>({
    rocket: 642,
    fire: 31,
    poop: 5,
    flag: 5
  });
  const [participants, setParticipants] = useState([
    { id: 1, name: "Anon#1234", speaking: false },
    { id: 2, name: "Degen#5678", speaking: true }
  ]);
  const { toast } = useToast();
  const conversation = useConversation();

  const handleVote = (type: keyof EmojiVote) => {
    setVotes(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    toast({
      title: "Vote recorded",
      description: `You voted with ${type} emoji!`,
    });
  };

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

        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            className="bg-[#2A2F3C] hover:bg-[#3A3F4C] flex flex-col items-center p-2"
            onClick={() => handleVote('rocket')}
          >
            <Rocket className="h-6 w-6 text-blue-400 mb-1" />
            <span className="text-white">{votes.rocket}</span>
          </Button>
          <Button
            variant="outline"
            className="bg-[#2A2F3C] hover:bg-[#3A3F4C] flex flex-col items-center p-2"
            onClick={() => handleVote('fire')}
          >
            <Flame className="h-6 w-6 text-orange-400 mb-1" />
            <span className="text-white">{votes.fire}</span>
          </Button>
          <Button
            variant="outline"
            className="bg-[#2A2F3C] hover:bg-[#3A3F4C] flex flex-col items-center p-2"
            onClick={() => handleVote('poop')}
          >
            <span className="text-4xl mb-1">💩</span>
            <span className="text-white">{votes.poop}</span>
          </Button>
          <Button
            variant="outline"
            className="bg-[#2A2F3C] hover:bg-[#3A3F4C] flex flex-col items-center p-2"
            onClick={() => handleVote('flag')}
          >
            <Flag className="h-6 w-6 text-red-400 mb-1" />
            <span className="text-white">{votes.flag}</span>
          </Button>
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