import React, { Component } from 'react'
import {connect} from 'react-redux'
import { withRouter, browserHistory } from 'react-router'
import {TimelineLite, TweenLite, Power2} from 'gsap'

class Home extends Component {
	constructor(props){
		super(props)

		this.state = {
      tl: null,
      reg: /^\/about$/,
      to: '/'
		}

		this.handleClick = this.handleClick.bind(this)
	}

	componentWillMount() {
    this.setState({tl: new TimelineLite()})
  }

  componentDidMount() {
		this.enteringAnim()
  }


  componentWillUpdate(nextProps, nextState) {
    if ( nextProps.isRouting && nextProps.nextKind != "about" ){
      this.leavingAnim()
    }
  }

  handleClick(e) {
    const {to} = this.state
    e.preventDefault()
    this.leavingAnim(() => {
			browserHistory.push(to)
    })
  }

  enteringAnim(){
		const {tl} = this.state
    const {container} = this.refs
    tl.from(container, 1,
    {
      opacity: 0,
      y:10,
      ease: Power2.easeOut
    })
  }

  leavingAnim(callback = null){
    const {tl} = this.state
    const {container} = this.refs
    const tweenContainer = new TweenLite.to(container, 1,
			{
				opacity:0,
				y:-30,
				ease: Power2.easeOut
			})
    tl.clear()
    tl.add([tweenContainer]).pause()
    if ( callback != null ){
      tl.add(callback, "-=0.8")
    }
    tl.play()
  }

	render() {
		const {to} = this.state
		return (
			<a href={to} className="link" onClick={this.handleClick} ref="container" >.home</a>
		)
	}
}

function mapStateToProps(state) {
  const { navigationReducer} = state

  const {
    isRouting: isRouting,
    nextRouteKind: nextKind,
    routeKind: kind
  } = navigationReducer

  return {
    isRouting,
    nextKind,
    kind
  }
}

export default connect(mapStateToProps)(Home)
