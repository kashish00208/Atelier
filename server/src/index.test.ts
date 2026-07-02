import { describe, expect, test } from '@jest/globals';
const BACKEND_URL = 'http://localhost:8080'
describe("chat application", () => {
    test("Message sent from room 1 reaches to another participants in room 1 ", async () => {
        const ws1 = new WebSocket(BACKEND_URL)
        const ws2 = new WebSocket(BACKEND_URL)
        console.log("Connection established")

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1
                if (count == 2) {
                    resolve()
                }
            }

            ws2.onopen = () => {
                count = count + 1
                if (count == 2) {
                    resolve()
                }
            }
        })
        console.log("Passed the first round")
        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        await new Promise<void>((resolve) => {
            ws2.onmessage = ({data}) => { 
                const parsedData = JSON.parse(data)
                expect(parsedData.type == "chat")
                expect(parsedData.message == "hi there")
            }
            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room 1",
                message: "Hi there"
            }))
        })

    })
});