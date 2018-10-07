#!/bin/bash

mvn clean package -Pprod -Dmaven.test.skip=true
