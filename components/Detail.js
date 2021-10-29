import Container from "./Container";
export default function Detail() {
  return (
    <Container>
      <h1 className="text-xs sm:text-base leading-6 sm:leading-8 text-center sm:text-left">
        <b>Wholdstill</b> is a content stabilizing software that uses face
        detection to determine the user’s relative position and shift the
        content on the device accordingly. <b>Wholdstill</b> is written entirely
        in Javascript and can be integrated with any website to improve the
        user’s experience in any shaky environment. Whether the motion is from
        the device, user, or both, the content will move to reduce the relative
        motion with the user. <b>Wholdstill</b> runs on the users’ browser and,
        thus, does not require an additional server. With users’ consent to
        access their webcam, the software is ready to make the whole screen stay
        still.
      </h1>
    </Container>
  );
}