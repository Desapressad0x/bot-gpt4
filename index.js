const fs = require('fs');
const {Client, Collection, GatewayIntentBits} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.slashCommands = new Collection();

const arquivos = fs.readdirSync('./comandos').filter((file) => file.endsWith('.js'));

for (const arq of arquivos) {
  const comando = require(`./comandos/${arq}`);
  client.slashCommands.set(comando.data.name, comando);
}

client.on('ready', async () => {
  console.log('Ligado.');

  for (const guild of client.guilds.cache.values()) {
    const comandos = await guild.commands.set(client.slashCommands.map(({data}) => data));
    console.log(`Registrado ${comandos.size} comando${comandos.size > 1 || comandos.size === 0 ? 's' : ''} pra guild ${guild.name}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const cmd = client.slashCommands.get(interaction.commandName);

  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ocorreu um erro.', ephemeral: true });
  }
});

client.login("TOKEN_DO_BOT");