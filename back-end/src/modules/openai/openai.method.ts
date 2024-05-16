

import OpenAI from "openai";
export async function createThread(openai: OpenAI, fileId) {
  try {
    const thread = await openai.beta.threads.create({
          messages: [
            {
              "role": "user",
              "content": "From the data set in the file, read carefully and combine it with the data you have, then create a set of about 20-30 questions with answers in json format in English and add it to the file. let me download it. The questions will range from easy, medium, difficult and very difficult. Difficult and very difficult level questions require more in-depth knowledge.",
              "attachments": [
                {
                  file_id: fileId,
                  tools: [{type: "code_interpreter"}]
                }
              ]
            }
          ]
        });
        return thread;
  } catch (error) {
    console.log(error.name, error.message);
    throw error;
  }
}
export async function createMessage(openai: OpenAI,threadId, userQuestion) {
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userQuestion,
    });
  } catch (error) {
    console.log(error.name, error.message);
    throw error;
  }
}

export async function getMessages(openai: OpenAI,{ threadId, runId }) {
  try {
    console.log(threadId);
    const messages = await openai.beta.threads.messages.list(threadId);
    // console.log(messages);
    // Find the last message for the current run
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === runId && message.role === "assistant"
      )
      .pop();
    console.log(lastMessageForRun.content);
    // If an assistant message is found, console.log() it
    // if (lastMessageForRun) {
    //   if (lastMessageForRun.content[0].text.annotations[0])
    //     return await openai.files.retrieveContent(
    //       lastMessageForRun.content[0].text.annotations[0]?.file_path.file_id
    //     );
     
    // }
    return null;
  } catch (error) {
    console.log(error.name, error.message);
    throw error;
  }
}
export async function createRuns(openai:OpenAI,{ threadId,assistant_id }) {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant_id,
    });
    return run;
  } catch (error) {
    console.log("run");
    console.log(error.name, error.message);
    throw error;
  }
}

export async function getStatus(openai:OpenAI,{ threadId, runId }) {
  try {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    return runStatus;
  } catch (error) {
    console.log("getStatus");
    console.log(error.name, error.message);
    throw error;
  }
}
export async function submitToolOutputs(openai:OpenAI,{ threadId, runId, toolOutputItems }) {
  try {
    await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: toolOutputItems,
    });
  } catch (error) {
    console.log("output tool");
    console.log(error.name, error.message);
    throw error;
  }
}