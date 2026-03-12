<script setup>
import { onLaunch, onShow } from "@dcloudio/uni-app";
import { setAgentId, preloadOnLaunch } from "./utils/agent";

onLaunch((options) => {
  // Extract agentId from launch options (QR code scene, query params, etc.)
  if (options?.query?.agentId) {
    setAgentId(options.query.agentId);
  }

  // WeChat Mini Program: decode scene parameter from QR code
  if (options?.query?.scene) {
    try {
      const scene = decodeURIComponent(options.query.scene);
      const params = new URLSearchParams(scene);
      if (params.get("agentId")) {
        setAgentId(params.get("agentId"));
      }
    } catch (e) {
      console.warn("Failed to parse scene parameter:", e);
    }
  }

  preloadOnLaunch();
});

onShow(() => {
  console.log("App Show");
});
</script>

<style>
page {
  background-color: #0d0221;
  font-family:
    -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #ffffff;
  min-height: 100vh;
}
</style>
