export default class ServerQueue {
	constructor(message) {
		this.serverId = message.guild.id;
		this.textChannel = message.channel;
		this.voiceChannel = message.member.voice.channel;
		this.connection = null;
		this.songs = new Array();
		this.volume = 1;
		this.isPlaying = true;
	}
}