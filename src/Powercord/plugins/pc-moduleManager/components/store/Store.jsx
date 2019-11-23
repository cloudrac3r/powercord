const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { Tooltip, Clickable, Icon, HeaderBar, AsyncComponent, Icons: { Server } } = require('powercord/components');

const VerticalScroller = AsyncComponent.from(getModuleByDisplayName('VerticalScroller'));

let cache = null;
module.exports = (type) =>
  class Store extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        search: '',
        classes: cache
      };
    }

    async componentDidMount () {
      if (this.state.classes === null) {
        cache = {
          headerBar: await getModule([ 'iconWrapper', 'clickable' ]),
          store: await getModule([ 'storeHomeWidth', 'container' ])
        };

        this.setState({ classes: cache });
      }
    }

    render () {
      /*

      **As far as I can tell, this is safe, but I'm definitely not going to run it and find out.**

      if (this.state.classes === null) {
        return null;
      }

      let a, i, r, g, m;
      try {
        a = (
          i = getModule(["windowSize"], false).windowSize().width,
          m = BigInt(i),
          [69, 109, 109, 97, 32, 105, 115, 32, 116, 104, 101, 32, 99, 117, 116, 101, 115, 116, 32, 98, 101, 105, 110, 103, 32, 111, 110, 32, 116, 104, 105, 115, 32, 112, 108, 97, 110, 101, 116]
            .map(BigInt)
            .map(n => BigInt(Math.floor(Math.pow(Number(n) * 420, 3.3236))))
            .forEach(n => m -= n)
          , // for me, m == -94721805493434175n
          m != 406874303128906n // so this is true
        )
      } catch(_) {
        a = false
      }

      if (!a) {
        /*
          If a is falsy, put one of these videos in an iframe and play it:
          h6DNdop6pD8: i turned a bad copypasta into a bad rap
          d1YBv2mWll0: Jebaited Song
          dQw4w9WgXcQ: Rick Astley - Never Gonna Give You Up (Video)
          A963X1RaRfk: Vsauce out of context
          q4OItmKWFKw: How To Make The Perfect Roast
          NHEaYbDWyQE: Michael Says Prime Numbers for 3 Hours

        const ids = [ 'h6DNdop6pD8', 'd1YBv2mWll0', 'dQw4w9WgXcQ', 'A963X1RaRfk', 'q4OItmKWFKw', 'NHEaYbDWyQE' ];
        return <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          <iframe width="100%" height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${ids[Math.floor(Math.random() * ids.length)]}`}
                  frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen/>
        </div>;
      }
      */
      const { headerBar, store } = this.state.classes;
      return <div className='powercord-text powercord-store'>
        <HeaderBar transparent={false} toolbar={this.renderToolbar()}>
          <Clickable
            className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}
            onClick={() => console.log('back')}
          >
            <Icon name='ArrowLeft' className={headerBar.icon}/>
          </Clickable>
          <HeaderBar.Title>Browse {type[0].toUpperCase() + type.slice(1)}</HeaderBar.Title>
        </HeaderBar>
        <VerticalScroller outerClassName={store.container}>
          {/* Object.values(Icon.Names).map(name => <Icon name={name}/>) */}
        </VerticalScroller>
      </div>;
    }

    renderToolbar () {
      const { headerBar } = this.state.classes;
      return <>
        <Tooltip text='Publish' position='bottom'>
          <div className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}>
            <Icon className={headerBar.icon} name='CloudUpload'/>
          </div>
        </Tooltip>
        {type === 'plugin' && <Tooltip text='Hosting' position='bottom'>
          <div className={[ headerBar.iconWrapper, headerBar.clickable ].join(' ')}>
            <Server className={headerBar.icon}/>
          </div>
        </Tooltip>}
      </>;
    }
  };
