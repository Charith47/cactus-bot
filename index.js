import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import dotenv from 'dotenv';
import ServerQueue from './ServerQueue.js';

dotenv.config();

const bot = new Discord.Client();
const servers = new Map();
const prefix = process.env.BOT_PREFIX;

const errorHandler = async (promise) => {
	// for reactions and sent messages only
	try {
		const data = await promise;
		return [data, null];
	} catch (error) {
		console.error(error);
		return [null, error];
	}
};

const playMusic = async (message, serverQueue) => {
	// check for the permissions first
	const permissions = message.channel.permissionsFor(bot.user).toArray();
	if (!permissions.includes('SPEAK') || !permissions.includes('CONNECT')) {
		return message.channel.send('✨Permission දීපන්✨');
	}

	// check if the member is joined to a voice channel
	if (message.member.voice.channel === null) {
		return message.channel.send('ප්ලීස් Voice Channel එකකට join වෙන්න 😐');
	} else {
		errorHandler(await message.react('▶️'));

		try{
			serverQueue.connection = await message.member.voice.channel.join();
		}
		catch(error){
			console.log(error);
			if(error.split(' ').includes('permission')) return errorHandler(await message.send('Need Permissions'))
		}


		// create a new dispatcher
		//const dispatcher = serverQueue.connection.play(ytdl('https://www.youtube.com/watch?v=UbOCUMy4QqE'),{ volume: 0.5 });

	}
};

bot.login(process.env.BOT_TOKEN);

bot.once('ready', () => {
	console.log('Ready!');
});

bot.once('reconnecting', () => {
	console.log('Reconnecting!');
});

bot.once('disconnect', () => {
	console.log('Disconnected!');
});

bot.on('message', async (message) => {
	// if message itself is from bot, stop
	if (message.author.bot) return;
	// if the message doesnt start with the prefix, stop
	if (!message.content.startsWith(prefix)) return;
	// else check if it is a valid command
	else {
		// we need to see which server the message is coming from
		const serverId = message.guild.id;

		// then, if a server does not exist on the map, create a new entry (serverID, new Queue)
		if (servers.get(serverId) === undefined) {
			servers.set(serverId, new ServerQueue(message));
		}

		if (message.content.startsWith(`${prefix}play`)) {
			playMusic(message, servers.get(serverId));
		} else if (message.content.startsWith(`${prefix}stop`)) {
			stopMusic(message, servers.get(serverId));
		} else if (message.content.startsWith(`${prefix}skip`)) {
			skipMusic(message, servers.get(serverId));
		} else if (message.content.startsWith(`${prefix}horny`)) {
			makeHorny(message);
		} else {
			message.react('🖕'); // do await
			message.channel.send('ආතල් දෙන්න එපා භල්ලො');
		}
	}
});
