import React from 'react'
import AppLayout from '../../ui/templates/appLayout'
import Header from './components/Header'
import Notifications from './components/Notifications'

function Alerts() {
  return (
    <AppLayout>
      <Header />
      <Notifications />
    </AppLayout>
  )
}

export default Alerts
