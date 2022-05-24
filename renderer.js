const setButton = document.getElementById('btn')
const commandInput = document.getElementById('command')
setButton.addEventListener('click', () => {
    const command = commandInput.value.split(/\s+/);
    console.log(command);

    window.electronAPI.handleCommandResponse((event, data) => {
        console.log(data);
    })

    window.electronAPI.runCommand(command)
});
