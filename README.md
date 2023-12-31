# aura

Aura is a lightweight [Internet LLM (illm)](https://github.com/ivynya/illm) client implementation. It lets you access your LLM server(s) from any computer with a web browser and internet connection, even if you aren't on the same network. To read more about how this works, see the [illm](https://github.com/ivynya/illm) repository.

## Usage

1. Set up and configure your illm server and provider(s) as described in the [illm](https://github.com/ivynya/illm) repository.
2. Open the aura client in your web browser
3. Optionally, you can install the client as a PWA for a more app-like experience. In Safari, click the share button and then "Add to Home Screen" or "Add to Dock". In Chrome and Edge, an install prompt in the URL bar at the top right of the screen should appear.
4. Follow the configuration instructions displayed:
5. /config username &lt;illm_auth_username&gt;
6. /config password &lt;illm_auth_password&gt;
7. /config endpoint &lt;example.com/illm/client&gt;
8. /config protocol &lt;wss|ws&gt;
9. Then, refresh the page (CMD/CTRL R or exit and reopen the PWA).

At the top, you should see that it displays `illm connected` with at least 1 client connected. If you see `illm disconnected`, check your configuration and try again. Something may be wrong with your illm server or provider.

## Commands

You can select a model at the top of the screen and type things into the chat input. Press enter to send.

If you are using the reference implementation of an illm client, you can also use these commands:

- /config &lt;key&gt; &lt;value&gt; - Set a configuration value
- /summarize &lt;youtube_url&gt; - Summarize a YouTube video

These commands may not work well on weaker machines or heavier models and you may experience connectivity errors or timeouts.

## Configuration

Aside from the authentication and endpoint config options described above, you can also configure which models are available as selections in the client. Enter in `/config models ["mistral","codellama"]` (no spaces) to set the available models to mistral and codellama.

Again, these models should be pre-pulled and available on your illm provider, and match the tags of the models pulled on your illm provider exactly.

## Functionality

Please keep in mind that Aura is not meant to cover the full breadth of an LLM API's functionality (e.g. ollama's API). It is meant to be a relatively lightweight and simple client.

If making an advanced or more feature-rich client for illm is something you're interested in, you can use Aura and the reference illm provider implementation as a starting point. Keep in mind that you will need to expand on both this client and the illm provider client to support more features. The illm server is agnostic and may be reused.
