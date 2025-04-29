// import React from 'react'
// import { BrowserRouter } from 'react-router-dom'
// import { IdleTimerProvider, useIdleTimer } from 'react-idle-timer'
// import { useAuth } from './AuthContex'
// import { useNavigate } from 'react-router-dom'

// const INACTIVITY_LIMIT = 1 * 60 * 1000 // 1 minuto

// function IdleLogout() {
//   const { logout } = useAuth()
//   const navigate = useNavigate()

//   const onIdle = () => {
//     logout()
//     navigate('/', { replace: true })
//   }

//   // hook que expone métodos adicionales si los necesitas
//   useIdleTimer({ timeout: INACTIVITY_LIMIT, onIdle })

//   return null
// }

// export const App: React.FC = () => (
//   <BrowserRouter>
//     <IdleTimerProvider timeout={INACTIVITY_LIMIT}>
//       <IdleLogout />
//     </IdleTimerProvider>
//   </BrowserRouter>
// )
