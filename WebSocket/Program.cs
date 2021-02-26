using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace WebSocket
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var contador = 0;
                IPAddress[] IpLocal = Dns.GetHostAddresses(Dns.GetHostName());
                string ipServidorWebSocket = "ws://192.168.137.1:9898";//definimos la ip del equipo server
                WebSocketServer servidorSocket = new WebSocketServer(ipServidorWebSocket);//instanciamos el servidor
                List<IWebSocketConnection> clientesSockets = new List<IWebSocketConnection>();//lista de clientes conectados
                Console.WriteLine("Servidor iniciado [" + Convert.ToString(IpLocal[1]) + "]" + DateTime.Now.ToString("dd/MM/yyyy"));
                servidorSocket.Start(clientesSocket =>
                {
                    clientesSocket.OnOpen = () =>//cuando alguien se conecta
                    {
                        clientesSockets.Add(clientesSocket);
                        Console.WriteLine("Hay " + clientesSockets.Count()+ " conectados");
                    };
                    clientesSocket.OnMessage = (string texto) =>//cuando se envia algo al server
                    {
                        contador++;
                        clientesSockets.ForEach(p => p.Send(texto));
                        Console.WriteLine(contador.ToString()+" "+ texto+" hora: "+DateTime.Now.ToString("HH:mm:ss"));
                    };
                    clientesSocket.OnClose = () =>//sale
                    {
                        clientesSockets.Remove(clientesSocket);
                        Console.WriteLine("Cliente desconectado");
                    };
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            Console.ReadKey();
        }
    }
}
