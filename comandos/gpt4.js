const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder().setName('gpt4').setDescription('Utilizar o GPT-4').addStringOption(option => option.setName('input').setDescription('Texto de entrada').setRequired(true)),
  async execute(interaction) {
	 await interaction.deferReply(); 
	  
     const res = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer API_KEY_OPENAI'
       },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{"role": "user", "content": interaction.options.getString('input')}],
          temperature: 0.7
        })
     })

    const kk = await res.json()
	
	if(!kk.choices[0].message.content) {
	  return interaction.editReply({ content: 'Ocorreu um erro.', ephemeral: true })
	}
		  
    await interaction.editReply({ content: kk.choices[0].message.content });
  },
};
