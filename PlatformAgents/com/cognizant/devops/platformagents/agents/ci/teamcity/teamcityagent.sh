#-------------------------------------------------------------------------------
# Copyright 2017 Cognizant Technology Solutions
#   
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------
#! /bin/sh
# /etc/init.d/__AGENT_KEY__

### BEGIN INIT INFO
# Provides: Runs a Python script on startup
# Required-Start: BootPython start
# Required-Stop: BootPython stop
# Default-Start: 2 3 4 5
# Default-stop: 0 1 6
# Short-Description: Simple script to run python program at boot
# Description: Runs a python program at boot
### END INIT INFO
#export INSIGHTS_AGENT_HOME=/home/ec2-user/insightsagents
source /etc/profile

case "$1" in
  start)
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsTeamCityAgent already running"
    else
     echo "Starting InSightsTeamCityAgent"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/teamcity
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.ci.teamcity.TeamCityAgent import TeamCityAgent; TeamCityAgent()" &
    fi
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsTeamCityAgent Started Sucessfully"
    else
     echo "InSightsTeamCityAgent Failed to Start"
    fi
    ;;
  stop)
    echo "Stopping InSightsTeamCityAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     sudo kill -9 $(ps aux | grep '__PS_KEY__' | awk '{print $2}')
    else
     echo "InSIghtsTeamCityAgent already in stopped state"
    fi
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsTeamCityAgent Failed to Stop"
    else
     echo "InSightsTeamCityAgent Stopped"
    fi
    ;;
  restart)
    echo "Restarting InSightsTeamCityAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsTeamCityAgent stopping"
     sudo kill -9 $(ps aux | grep '__PS_KEY__' | awk '{print $2}')
     echo "InSightsTeamCityAgent stopped"
     echo "InSightsTeamCityAgent starting"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/teamcity
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.ci.teamcity.TeamCityAgent import TeamCityAgent; TeamCityAgent()" &
     echo "InSightsTeamCityAgent started"
    else
     echo "InSightsTeamCityAgent already in stopped state"
     echo "InSightsTeamCityAgent starting"
     cd $INSIGHTS_AGENT_HOME/PlatformAgents/teamcity
     python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.ci.teamcity.TeamCityAgent import TeamCityAgent; TeamCityAgent()" &
     echo "InSightsTeamCityAgent started"
    fi
    ;;
  status)
    echo "Checking the Status of InSightsTeamCityAgent"
    if [[ $(ps aux | grep '__PS_KEY__' | awk '{print $2}') ]]; then
     echo "InSightsTeamCityAgent is running"
    else
     echo "InSightsTeamCityAgent is stopped"
    fi
    ;;
  *)
    echo "Usage: /etc/init.d/__AGENT_KEY__ {start|stop|restart|status}"
    exit 1
    ;;
esac
exit 0
