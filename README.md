Setting Up a MongoDB Replica Set Using Docker on a Single Machine

This guide provides step-by-step instructions to set up a MongoDB replica set using Docker on a single computer. This setup is ideal for development and testing purposes, allowing you to simulate a replica set environment locally.

Table of Contents

	•	Prerequisites
	•	Overview
	•	Steps
	•	1. Create a Docker Network
	•	2. Run MongoDB Containers
	•	3. Initialize the Replica Set
	•	4. Test the Replica Set
	•	5. Connect to the Replica Set
	•	6. Clean Up (Optional)
	•	Additional Notes
	•	Troubleshooting
	•	References
	•	License

Prerequisites

	•	Docker Installed: Ensure that Docker is installed and running on your computer.
	•	Basic Knowledge: Familiarity with Docker and MongoDB commands.

Overview

We will create three MongoDB instances using Docker containers, each running on different ports. We will then configure them to function as a replica set named rs0.

Steps

1. Create a Docker Network

Create a custom Docker network so that the MongoDB containers can communicate with each other.
```bash
docker network create mongo-repl-set
```
2. Run MongoDB Containers

Start three MongoDB containers, each mapped to a different host port.

Container 1
```bash
docker run -d \
  --name mongo1 \
  --net mongo-repl-set \
  -p 27017:27017 \
  mongo:latest \
  --replSet rs0
```

Container 2
```bash
docker run -d \
  --name mongo2 \
  --net mongo-repl-set \
  -p 27018:27017 \
  mongo:latest \
  --replSet rs0
```

Container 3
```bash
docker run -d \
  --name mongo3 \
  --net mongo-repl-set \
  -p 27019:27017 \
  mongo:latest \
  --replSet rs0
```

Explanation:

	•	--name: Assigns a name to the container.
	•	--net: Connects the container to the specified Docker network.
	•	-p: Maps host ports to container ports (hostPort:containerPort).
	•	mongo:latest: Uses the latest MongoDB image.
	•	--replSet rs0: Sets the replica set name to rs0.

3. Initialize the Replica Set

Connect to one of the MongoDB instances and initiate the replica set.

Connect to Mongo Shell in Container 1
```
docker exec -it mongo1 mongo
```

Initiate the Replica Set

In the Mongo shell, run:
```bash
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
```
Explanation:

	•	_id: The name of the replica set (should match --replSet parameter).
	•	members: An array of replica set members with their IDs and host addresses.

Check Replica Set Status
```bash
rs.status()
```
You should see that one member is PRIMARY and the others are SECONDARY.

Exit the Mongo shell:

```
exit
```

4. Test the Replica Set

Simulate a Failover

Stop the primary node to test automatic failover:

docker stop mongo1

Connect to another node’s Mongo shell:
```bash
docker exec -it mongo2 mongo
```
Check the replica set status:
```bash
rs.isMaster()
```
You should see that a new PRIMARY has been elected.

Restart the stopped container:

docker start mongo1

5. Connect to the Replica Set

Use the following connection string in your application to connect to the replica set:

```mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0```

Example using Mongo Shell:

```mongo --host "localhost:27017,localhost:27018,localhost:27019" --replicaSet rs0```

6. Clean Up (Optional)

To stop and remove the containers and network when you’re done:
```bash
docker stop mongo1 mongo2 mongo3
docker rm mongo1 mongo2 mongo3
docker network rm mongo-repl-set
```
Additional Notes

	•	Data Persistence: This setup doesn’t include data persistence. To persist data, you should mount volumes to store data outside the container.
Example:
```bash
docker run -d \
  --name mongo1 \
  --net mongo-repl-set \
  -p 27017:27017 \
  -v ~/mongo/data1:/data/db \
  mongo:latest \
  --replSet rs0
```

	•	Security: This setup is intended for local development and testing. For production environments:
	•	Implement authentication mechanisms.
	•	Secure network communication with TLS/SSL.
	•	Use configuration files or environment variables to manage settings securely.
	•	MongoDB Version: The mongo:latest image pulls the latest version of MongoDB. If you require a specific version, replace latest with the desired version number (e.g., mongo:6.0).

Troubleshooting

	•	Permission Issues: If you encounter permission issues when mounting volumes, ensure that the Docker user has the necessary permissions to read/write to the host directories.
	•	Port Conflicts: If the ports 27017, 27018, or 27019 are already in use, choose alternative ports and adjust the commands accordingly.
	•	Container Names: Ensure that container names (mongo1, mongo2, mongo3) are unique and not already in use.
	•	Replica Set Name Mismatch: The replica set name specified in --replSet rs0 must match the _id in the rs.initiate() command.
	•	Networking Issues: All containers must be on the same Docker network to communicate. Verify the network configuration if connectivity issues arise.

References

	•	MongoDB Documentation on Replica Sets
	•	Docker Documentation
	•	MongoDB Docker Official Image

License

This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to copy and paste this documentation into your GitHub repository’s README.md file. Adjust any paths or configurations to match your specific environment or requirements.