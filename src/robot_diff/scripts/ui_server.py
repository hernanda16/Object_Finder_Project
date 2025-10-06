#!/usr/bin/python
import rospy
from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b"<html><body><h1>ROS HTTP Server Running</h1></body></html>")

def run_http_server(server_class=HTTPServer, handler_class=SimpleHandler, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    rospy.loginfo(f"Starting HTTP server on port {port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    rospy.loginfo("HTTP server stopped.")

if __name__ == '__main__':
    rospy.init_node('ui_http_server')
    run_http_server()