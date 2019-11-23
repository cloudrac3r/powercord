const { React } = require('powercord/webpack');
const { Icon, Icons: { Unlink } } = require('powercord/components');

const Account = require('./Account.jsx');

module.exports = (props) => {
  const syncEnabled = powercord.settings.get('settingsSync', false);

  return <div className='powercord-account-list'>
    <div className='powercord-account-list-accounts'>
      <Account type='spotify'/>
      <Account type='github'/>
      {syncEnabled && <div className='powercord-account-list-account'>
        <Icon name='Key'/>
        <a className='powercord-account-item' href='#' onClick={() => props.passphrase()}>Update passphrase</a>
      </div>}
    </div>
    <div>
      <div className='powercord-account-list-account'>
        <Icon name='Synced'/>
        <a className='powercord-account-item' href='#' onClick={() => props.refresh()}>Refresh accounts</a>
      </div>

      <div className='powercord-account-list-account'>
        <Unlink/>
        <a className='powercord-account-item' href='#' onClick={() => props.unlink()}>Unlink</a>
      </div>
    </div>
  </div>;
};
