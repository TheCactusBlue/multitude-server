import * as mediasoup from 'mediasoup';

export let router: mediasoup.types.Router = (null as any);

export async function createVoice() {
  const worker = await mediasoup.createWorker({
    logLevel: "debug",
  });

  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
      }
    ]
  });
  return { worker, router }
}

async function createTransport(router: mediasoup.types.Router) {
  return await router.createWebRtcTransport({
    listenIps: [
      { ip: "127.0.0.1" },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });
}