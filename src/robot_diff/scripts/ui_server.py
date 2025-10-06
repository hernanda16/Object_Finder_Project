#!/usr/bin/env python3
import os
import threading
from functools import partial

import rospy
import rospkg
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

def start_http_server(port=8080, directory=None):
    if directory is None:
        directory = os.getcwd()

    handler = partial(SimpleHTTPRequestHandler, directory=directory)
    server = ThreadingHTTPServer(("", port), handler)

    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()

    rospy.loginfo(f"Started HTTP server on port {port}, serving: {directory}")
    return server


def stop_http_server(server):
    if server is None:
        return
    try:
        server.shutdown()
        server.server_close()
        rospy.loginfo("HTTP server stopped.")
    except Exception as e:
        rospy.logerr(f"Error stopping HTTP server: {e}")


if __name__ == '__main__':
    rospy.init_node('ui_http_server')

    # parameters
    port = rospy.get_param('~port', 8080)
    # default UI folder inside the package
    try:
        rospack = rospkg.RosPack()
        pkg_path = rospack.get_path('robot_diff')
        default_www = os.path.join(pkg_path, 'www')
    except Exception:
        default_www = os.path.join(os.getcwd(), 'www')

    ui_root = rospy.get_param('~ui_root', default_www)

    if not os.path.isdir(ui_root):
        rospy.logwarn(f"UI root '{ui_root}' does not exist. Create it and put index.html/index.js there.")

    server = None
    try:
        server = start_http_server(port=int(port), directory=ui_root)
        rospy.on_shutdown(lambda: stop_http_server(server))
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
    finally:
        stop_http_server(server)