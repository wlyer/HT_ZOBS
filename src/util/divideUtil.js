
export default {
	/**
	 * 左右分栏中间有拖线可以拖动的方法
	 * @param {String} containerDivId 大容器的id
	 * @param {String} leftDivId 左边栏id
	 * @param {String} middleDivId 中间拖线的id
	 * @param {String} rightDivId 右边栏id
	 */
	divideFun :function (containerDivId, leftDivId, middleDivId, rightDivId) {
		var container = document.getElementById(containerDivId);
		var left = document.getElementById(leftDivId);
		var middle = document.getElementById(middleDivId);
		var right = document.getElementById(rightDivId);
		var middleWidth=9;
		middle.onmousedown = function(e) {
			var disX = (e || event).clientX;
			middle.left = middle.offsetLeft;
			document.onmousemove = function(e) {
				var iT = middle.left + ((e || event).clientX - disX);
				var e=e||window.event,tarnameb=e.target||e.srcElement;
				var maxT=container.clientWidth;
				iT < 0 && (iT = 0);
				iT > maxT && (iT = maxT);
				middle.style.left = left.style.width = iT + "px";
				right.style.width = container.clientWidth - iT -middleWidth + "px";
				right.style.left = iT+middleWidth+"px";
				return false
			};
			document.onmouseup = function() {
				document.onmousemove = null;
				document.onmouseup = null;
				middle.releaseCapture && middle.releaseCapture()
			};
			middle.setCapture && middle.setCapture();
			return false
		};
	}
}
