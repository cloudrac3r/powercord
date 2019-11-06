const { get } = require('powercord/http');
const { React, getModule } = require('powercord/webpack');
const { WEBSITE } = require('powercord/constants');
const { TextInput } = require('powercord/components/settings');
const { Button, Divider, Spinner, FormNotice } = require('powercord/components');

const Plugin = require('./Plugin');
/*
 * const { open: openModal, close: closeModal } = require('powercord/modal');
 * const { asyncArray: { map } } = require('powercord/util');
 * const { Confirm } = require('powercord/components/modal');
 *
 */

module.exports = class Explore extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      installed: false,
      loading: true,
      search: '',
      plugins: [],
      page: 0,
      allLoaded: false
    };
  }

  get plugins () {
    return this.state.plugins.filter(p => !powercord.pluginManager.isInstalled(p.id));
  }

  async componentDidMount () {
    this.state.scrollerClass = `.${(await getModule([ 'scroller', 'scrollerWrap' ])).scroller.split(' ')[0]}`;

    await this._fetchPlugins();
    this._listener = this._handleScroll.bind(this);

    if (document.querySelector('.powercord-plugins')) {
      document.querySelector('.powercord-plugins').closest(this.state.scrollerClass).addEventListener('scroll', this._listener);
    }
  }

  componentWillUnmount () {
    if (document.querySelector('.powercord-plugins')) {
      document.querySelector('.powercord-plugins').closest(this.state.scrollerClass).removeEventListener('scroll', this._listener);
    }
  }

  render () {
    return <div className='powercord-plugins'>
      <FormNotice
        imageData={{
          width: 60,
          height: 60,
          src: '/assets/0694f38cb0b10cc3b5b89366a0893768.svg'
        }}
        type={FormNotice.Types.DANGER}
        title='Experimental feature'
        body={'This part of Powercord is experimental. Powercord Staff won\'t accept any bug reports nor provide support for it. Use it at your own risk!'}
        className='powercord-plugins-wip'
      />
      <div className='powercord-plugins-header'>
        <h3>Explore plugins</h3>
        <Button onClick={() => this.props.goToInstalled()}>Installed Plugins</Button>
        <div class='powercord-folders-opener'>
          <Button color={Button.Colors.PRIMARY} look={Button.Looks.OUTLINED} onClick={() => this.props.openFolder(powercord.pluginManager.pluginDir)}>Open Plugins Folder</Button>
        </div>
      </div>
      <Divider/>
      <div className='powercord-plugins-topbar'>
        <TextInput
          value={this.state.search}
          onChange={v => this.setState({ search: v })}
          placeholder='What are you looking for?'
        >
          Search plugins...
        </TextInput>
        <Button onClick={() => this._reloadPlugins()}>Refresh List</Button>
      </div>
      <div className='powercord-plugins-container'>
        {this.plugins.map(plugin => <Plugin
          id={plugin.id}
          manifest={plugin}
          onInstall={() => this.install(plugin.id)}
        />)}
        {this.state.loading && <Spinner/>}
      </div>
    </div>;
  }

  async install (pluginID) {
    await powercord.pluginManager.install(pluginID);
    this.forceUpdate();
  }

  _handleScroll (e) {
    if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) < 10 && !this.state.loading) {
      this._fetchPlugins();
    }
  }

  _reloadPlugins () {
    this.setState({
      plugins: [],
      page: 0,
      allLoaded: false
    });

    setImmediate(() => this._fetchPlugins());
  }

  async _fetchPlugins () {
    if (this.state.allLoaded) {
      return;
    }

    this.setState({ loading: true });
    const baseUrl = powercord.settings.get('backendURL', WEBSITE);
    const plugins = await get(`${baseUrl}/api/plugins?page=${this.state.page}`).then(r => r.body);

    this.setState({
      loading: false,
      plugins: [ ...this.state.plugins, ...plugins ],
      page: this.state.page + 1,
      allLoaded: plugins.length === 0
    });
  }
};
