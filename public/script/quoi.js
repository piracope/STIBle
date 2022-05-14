const INTERVAL = 2000;

$(() => {
    const max = $("#blague").children().length;
    let i = 0;
    const s = setInterval(() => {
        $("#blague").children()
            .eq(i++)
            .fadeIn(INTERVAL);

        if (i >= max) {
            clearInterval(s);
        }
    }, INTERVAL);
});
