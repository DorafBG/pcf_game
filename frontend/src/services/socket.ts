import { io, Socket } from 'socket.io-client'

// URL de ta Gateway (par exemple http://localhost:3000)
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000'

class SocketService {
  private socket: Socket | null = null

  // Connecter le WebSocket avec transmission du token JWT si disponible
  connect(): Socket {
    if (!this.socket) {
      const token = localStorage.getItem('token')

      this.socket = io(GATEWAY_URL, {
        autoConnect: true,
        auth: {
          token: token ? `Bearer ${token}` : ''
        }
      })

      this.socket.on('connect', () => {
        console.log('⚡ Connecté à la Gateway WebSocket ! ID:', this.socket?.id)
      })

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Déconnecté du WebSocket:', reason)
      })

      this.socket.on('connect_error', (error) => {
        console.error('⚠️ Erreur de connexion WebSocket:', error.message)
      })
    }

    return this.socket
  }

  // Obtenir l'instance courante du Socket
  getSocket(): Socket | null {
    return this.socket
  }

  // Déconnecter proprement le WebSocket (par exemple à la déconnexion de l'utilisateur)
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketService = new SocketService()