import React, { Component } from 'react'
import {withRouter, browserHistory} from 'react-router'
import {connect} from 'react-redux'
import {TimelineLite, TweenLite, Power2} from 'gsap'
import {LANDSCAPE} from 'APP/Store/responsive/actions'

class Next extends Component {
	constructor(props){
		super(props)
		this.state = {
      tl: null,
      prefix: '/projects/',
      sufix: '/detail',
      reg: /detail$/
		}

		this.handleClick = this.handleClick.bind(this)
	}

	componentWillMount() {
    this.setState({tl: new TimelineLite()})
  }

  componentDidMount() {
		this.enteringAnim()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {reg} = this.state
    if ( reg.test(nextProps.location.pathname)){
      return true
    }
    return false
  }

  componentDidUpdate(prevProps, prevState) {
		const {isRouting} = this.props
		if ( isRouting ){
			this.leavingAnim()	
		} else {
			this.enteringAnim()
		}
  }

	handleClick(e){
		const {sufix, prefix} = this.state
		const next = this.getNextProject()
		e.preventDefault()
    this.leavingAnim(() => {
			browserHistory.push(prefix+next+sufix)
    })
	}

	getNextProject(){
		const {params, data} = this.props
		const next = data.details[params.name].next
		return next
	}

	enteringAnim(){
    const {tl} = this.state
    const {main} = this.refs
    const {orientation} = this.props
    let tweenMain
    if ( orientation == LANDSCAPE ){
      tweenMain = new TweenLite.fromTo(main, 1,
        {
          opacity: 0,
          x:10
        },
        {
          opacity: 1,
          x:0,
          ease: Power2.easeOut
        })
    } else {
      tweenMain = new TweenLite.fromTo(main, 1,
        {
          opacity: 0,
          y:10
        },
        {
          opacity: 1,
          y:0,
          ease: Power2.easeOut
        })
    }
    tl.clear()
    tl.add([tweenMain])
  }

  leavingAnim(callback = null){
    const {tl} = this.state
    const {main} = this.refs
    const {orientation} = this.props
    let tweenMain
    if ( orientation == LANDSCAPE ){
      tweenMain = new TweenLite.to(main, 1,
        {
          opacity:0,
          x:-30,
          ease: Power2.easeOut
        })
    } else {
      tweenMain = new TweenLite.to(main, 1,
        {
          opacity:0,
          y:-30,
          ease: Power2.easeOut
        })
    }
    
    tl.clear()
    tl.add([tweenMain]).pause()
    if ( callback != null ){
      tl.add(callback, "-=0.8")
    }
    tl.play()
  }

	render() {
		const next = this.getNextProject()
		return (
			<a href="#" onClick={this.handleClick} className="link next" ref="main">
				<div className="text">.next</div>
				<div className="shadowy">{next}</div>
			</a>
		)
	}
}

function mapStateToProps(state) {
  const { contentReducer} = state
  const { navigationReducer} = state
  const { responsiveReducer} = state

  const {
    items: data
  } = contentReducer

  const {
    orientation: orientation
  } = responsiveReducer

  const {
    nextRoute: reduxNextRoute,
    isRouting: isRouting,
    nextRouteKind: nextKind,
    routeKind: kind
  } = navigationReducer

  return {
    data,
    orientation,
    reduxNextRoute,
    isRouting,
    kind,
    nextKind
  }
}


export default connect(mapStateToProps)(withRouter(Next))