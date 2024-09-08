export async function joinNewsletter(email: string) {
    console.log("Email:" + email);
    const res = await fetch('/api/newsletter/', {
        method: 'POST',
        body: JSON.stringify({ email: email }) // Send email as part of an object
    });
    return res.json();
}