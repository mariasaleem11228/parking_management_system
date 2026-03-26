#!/bin/bash
mvn -q -DskipTests compile && echo BUILD_OK
mvn -q -DskipTests package && echo PACKAGE_OK
mvn clean test
