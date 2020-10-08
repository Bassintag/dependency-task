import { buildDependencyTask } from "../buildDependencyTask";

describe("buildDependencyTask", () => {
  it("should let the callable resolve", async (done) => {
    let ran1: boolean = false;
    let ran2: boolean = false;
    await buildDependencyTask({
      steps: [
        {
          id: "1",
          skip: () => {
            console.log("Check SKIP");
            return true;
          },
          run: async () => {
            console.log("Check RUN");
            ran1 = true;
          },
        },
        {
          id: "2",
          run: async () => {
            expect(ran1).toBeFalsy();
            ran2 = true;
          },
        },
      ],
      context: null,
    }).run();
    expect(ran1).toBeFalsy();
    expect(ran2).toBeTruthy();
    done();
  });
});
