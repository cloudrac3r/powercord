const { existsSync, lstatSync } = require('fs');
const { React, getModule } = require('powercord/webpack');
const { SwitchItem, TextInput, Category } = require('powercord/components/settings');

const { getGuild } = getModule([ 'getGuild' ]);
const { getSortedGuilds } = getModule([ 'getSortedGuilds' ]);

module.exports = class EmojiUtilitySettings extends React.Component {
  constructor (props) {
    super();

    this.settings = props.settings;
    this.state = Object.assign({
      isFilePathValid: props.settings.get('filePath') ? existsSync(props.settings.get('filePath')) : true,
      initialFilePathValue: props.settings.get('filePath') || null,

      isCloneIdValid: props.settings.get('defaultCloneId') ? getGuild(props.settings.get('defaultCloneId')) : true,
      initialCloneIdValue: props.settings.get('defaultCloneId') || null,

      hiddenGuilds: props.settings.get('hiddenGuilds', [])
    }, this.settings.config);
  }

  render () {
    const settings = this.state;

    return (
      <div>
        <SwitchItem
          note='Whether Emote Utility should return responses in embeds.'
          value={settings.useEmbeds}
          onChange={() => this.set('useEmbeds')}
        >
          Use embeds
        </SwitchItem>

        <SwitchItem
          note='Whether to display the Send Link button when right-clicking an emote.'
          value={settings.displaySendLink}
          onChange={() => this.set('displaySendLink')}
        >
          Enable Send Link
        </SwitchItem>

        {!settings.useEmbeds && (
          <SwitchItem
            note='Whether the message for the findemote command should contain the link to the guild the emote is in.'
            value={settings.displayLink}
            onChange={() => this.set('displayLink')}
          >
            Display link
          </SwitchItem>
        )}

        <TextInput
          note='The directory emotes will be saved to.'
          defaultValue={settings.filePath}
          style={!this.state.isFilePathValid ? { borderColor: 'red' } : {}}
          onChange={(value) => {
            if (value.length === 0 || (existsSync(value) && lstatSync(value).isDirectory())) {
              this.setState({
                isFilePathValid: true
              });

              this.set('filePath', value.length === 0 ? null : value);
            } else {
              this.setState({
                isFilePathValid: false
              });

              this.set('filePath', this.state.initialFilePathValue);
            }
          }}
        >
          Save directory
        </TextInput>

        <SwitchItem
          note='Whether saving emotes should contain the id of the emote, this prevents overwriting old saved emotes.'
          value={settings.includeIdForSavedEmojis}
          onChange={() => this.set('includeIdForSavedEmojis')}
        >
          Include ID when saving emotes
        </SwitchItem>

        <SwitchItem
          note='Whether the default server for cloning emotes should be the server you are currently in.'
          value={settings.defaultCloneIdUseCurrent}
          onChange={() => this.set('defaultCloneIdUseCurrent')}
        >
          Use current server when cloning emotes
        </SwitchItem>

        {!settings.defaultCloneIdUseCurrent && (
          <TextInput
            note='The default server id which will be used to save cloned emotes.'
            defaultValue={settings.defaultCloneId}
            style={!this.state.isCloneIdValid ? { borderColor: 'red' } : {}}
            onChange={(value) => {
              if (value.length === 0 || getGuild(value)) {
                this.setState({
                  isCloneIdValid: true
                });

                this.set('defaultCloneId', value.length === 0 ? null : value);
              } else {
                this.setState({
                  isCloneIdValid: false
                });

                this.set('defaultCloneId', this.state.initialCloneIdValue);
              }
            }}
          >
            Default server ID when cloning emotes
          </TextInput>
        )}

        <Category
          name='Hide emotes'
          description={'Hide emotes from some servers. They won\'t show up in emote picker, except in searches.'}
          opened={this.state.categoryOpened}
          onChange={() => this.setState({ categoryOpened: !this.state.categoryOpened })}
        >
          {getSortedGuilds().map(g => g.guild).map(g => <SwitchItem
            value={settings.hiddenGuilds.includes(g.id)}
            onChange={() => this._handleGuildToggle(g.id)}
          >
            Hide emojis from {g.name}
          </SwitchItem>)}
        </Category>
      </div>
    );
  }

  set (key, value = !this.state[key], defaultValue) {
    if (!value && defaultValue) {
      value = defaultValue;
    }

    this.settings.set(key, value);
    this.setState({
      [key]: value
    });
  }

  _handleGuildToggle (id) {
    if (!this.state.hiddenGuilds.includes(id)) {
      this.set('hiddenGuilds', [ ...this.state.hiddenGuilds, id ]);
    } else {
      this.set('hiddenGuilds', this.state.hiddenGuilds.filter(g => g !== id));
    }
  }
};
