import "reflect-metadata"
import { createConnection, Repository } from "typeorm"
import User from "./entity/User"
import Duel from "./entity/Duel"

export default class Database {

    public async init() {
        await createConnection()
        /*let connection = await createConnection()
        /*this.userRepo = connection.getRepository(User)
        this.duelRepo = connection.getRepository(Duel)
        let testUser1 = new User("78594645642", "Dada")
        let testUser2 = new User("785946745642", "Dada2")
        let testDuel = new Duel()
        console.log("Created objects")
        await userRepo.save(testUser1)
        await userRepo.save(testUser2)
        console.log("Saved users")

        console.log("Saving duel")
        testDuel.participants = [testUser1, testUser2]
        await duelRepo.save(testDuel)
        console.log("Done")
        await connection.close()
        process.exit(0)*/
        //await userRepo.save(testUser1)
        //await userRepo.save(testUser2)
    }

    public async getOrCreateUpdatedUser(discordId: string, discordName: string, loadRequests: boolean = false): Promise<User> {
        let x = {}
        
        if(loadRequests) {
            x = {relations: ["requestedDuels", "receivedDuels", "requestedDuels.receivingUser", "receivedDuels.requestingUser"]}
        }

        let found = await User.findOne(discordId, x)
        if(found === undefined) {
            found = new User(discordId, discordName);
            User.save(found)
            return found
        } else {
            if(found.discordName !== discordName) {
                found.discordName = discordName;
                User.save(found)
            }
            return found
        }
    }
}