set -e
sudo apt update
sudo apt install -y \
    ros-noetic-tf2-ros \
    ros-noetic-turtlebot3 \
    ros-noetic-turtlebot3-simulations \
    ros-noetic-turtlebot3-gazebo \
    ros-noetic-gmapping \
    ros-noetic-rviz \
    ros-noetic-map-server \
    ros-noetic-amcl \
    ros-noetic-move-base \
    ros-noetic-navigation

git submodule update --init --recursive
echo "=== Submodules status ==="
git submodule status
echo "========= Done =========="