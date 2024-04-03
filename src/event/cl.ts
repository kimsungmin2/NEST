// let localStream;
// let localVideo = document.getElementById('localVideo'); // localVideo에 해당하는 DOM 요소를 정의해야 합니다.
// let peerInfo = {}; // peerInfo 객체 초기화
// let selectedRoom = 'yourRoomId'; // 적절한 방 ID로 설정해야 합니다.
// let webRtcSocket = io('yourSocketServerUrl'); // 실제 소켓 서버 URL로 설정해야 합니다.

// async function start() {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localVideo.srcObject = localStream;
//   } catch (error) {
//     console.error('Error accessing media devices:', error);
//   }
// }

// const makePeerConnect = async (userId) => {
//   const peerConnection = new RTCPeerConnection({
//     iceServers: [
//       {
//         urls: 'stun:stun.l.google.com:19302',
//       },
//     ],
//   });

//   peerConnection.addEventListener('icecandidate', icecandidate);
//   peerConnection.addEventListener('track', addStream);

//   localStream.getTracks().forEach((track) => {
//     peerConnection.addTrack(track, localStream);
//   });

//   peerInfo[userId] = { peerConnection }; // userId를 사용하여 peerConnection 저장
// };

// const icecandidate = async (event) => {
//   try {
//     if (event.candidate) {
//       webRtcSocket.emit('icecandidate', {
//         candidate: event.candidate,
//         selectedRoom,
//       });
//     }
//   } catch (error) {
//     console.log('send candidate error : ', error);
//   }
// };

// const addStream = (event) => {
//   let videoArea = document.createElement('video');
//   videoArea.autoplay = true;
//   videoArea.srcObject = event.streams[0]; // addStream 이벤트는 streams 배열을 포함합니다.
//   document.getElementById('root').appendChild(videoArea); // 'root'는 비디오 태그를 추가할 컨테이너의 ID입니다.
// };

// // 이 부분은 실제 소켓 이벤트를 처리하는 로직으로, 소켓 서버 설정에 따라 다를 수 있습니다.
// webRtcSocket.on('enter', async (data) => {
//   // 다른 사용자가 방에 입장했을 때의 로직
// });

// // 기타 offer, answer 처리 등의 로직 추가
