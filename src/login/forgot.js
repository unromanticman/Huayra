import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

class ForgotPage extends Component {
  constructor () {
    super()
    this.input = {}
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      help: {}
    }
  }

  componentDidMount () {
    if (this.input.email) {
      this.input.email.focus()
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()

    this.setState({
      loading: true
    })

    let header = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    let data = new URLSearchParams({
      email: this.input.email.value()
    })

    let sentData = {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      header: header,
      body: data
    }

    fetch('/login/forgot/', sentData)
      .then(r => r.json())
      .then(r => {
        if (r.success === true) {
          this.setState({
            success: true,
            error: '',
            loading: false
          })
        } else {
          let state = {
            success: false,
            error: '',
            loading: false,
            hasError: {},
            help: {}
          }
          for (let key in r.errfor) {
            state.hasError[key] = true
            state.help[key] = r.errfor[key]
          }

          if (r.errors[0] !== undefined) {
            state.error = r.errors[0]
          }
          this.setState(state)
        }
      }).catch(e => {
        console.error(e)
      })
  }

  render () {
    let alert = []
    const isIE = (navigator.userAgent.search('Trident') || navigator.userAgent.search('MSIE')) > -1

    if (isIE) {
      this.setState({
        success: false,
        error: '本服務目前不支援 Internet Explorer 瀏覽器，請切換其他瀏覽器後繼續使用。',
        loading: true
      })
    }

    if (this.state.success) {
      alert = <div key='success'>
        <Alert
          type='success'
          message='若此帳號存在，您將會收到一封重置的 email。'
        />
        <Link to='/login' className='btn btn-link'>返回登入</Link>
      </div>
    } else if (this.state.error) {
      alert = <Alert
        type='danger'
        message={this.state.error}
      />
    }

    let formElements

    if (!this.state.success) {
      formElements = <fieldset>
        <TextControl
          ref={(c) => (this.input.email = c)}
          name='email'
          label='您帳號的 email 是?'
          hasError={this.state.hasError.email}
          help={this.state.help.email}
          disabled={this.state.loading}
        />
        <ControlGroup hideLabel hideHelp>
          <Button
            type='submit'
            inputClasses={{ 'btn-primary': true }}
            disabled={this.state.loading}>
            重置
            <Spinner space='left' show={this.state.loading} />
          </Button>
          <Link to='/login' className='btn btn-link'>返回登入</Link>
        </ControlGroup>
      </fieldset>
    }

    return (
      <section className='container'>
        <Helmet>
          <title>忘記密碼</title>
        </Helmet>
        <div className='container'>
          <h1 className='page-header'>忘記您的密碼?</h1>
          <div className='row'>
            <div className='col-sm-6'>
              <form onSubmit={this.handleSubmit.bind(this)}>
                {alert}
                {formElements}
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default ForgotPage
