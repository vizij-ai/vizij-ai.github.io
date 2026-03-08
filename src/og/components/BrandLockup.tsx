import { siteConfig } from "@/site.config";
import React from "react";
import { TEXT_PRIMARY } from "../constants";

export const BrandLockup = () => (
	<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
		<svg width="34" height="34" viewBox="0 0 412 412" xmlns="http://www.w3.org/2000/svg">
			<g transform="translate(604.607 194.034)">
				<g transform="translate(-331.8 16.33)">
					<path
						d="M0 83.231L-63.499 46.568-123.354 81.126V52.887L-31.75 0 31.749 36.66 63.501 18.331 87.955 32.449 0 83.231Z"
						fill="#FFC400"
					/>
				</g>
				<g transform="translate(-486.902 10.015)">
					<path
						d="M0 4.208L63.499-32.453V-101.562L87.928-87.463 88.043 18.277 24.454 54.99V91.651L0 105.77V4.208Z"
						fill="#2AA499"
					/>
				</g>
				<g transform="translate(-335.448 -6.213)">
					<path
						d="M0-71.217V2.106L59.854 36.662 35.396 50.781-56.157-2.078-56.237-75.449-87.955-93.755V-121.998L0-71.217Z"
						fill="#EF6129"
					/>
				</g>
				<g transform="translate(-300.051 -128.214)">
					<path
						d="M0 136.12L-28.103 119.895V50.784L59.858 0 59.94 101.514 0 136.12Z"
						fill="#EC4D01"
					/>
				</g>
				<g transform="matrix(-.866025 .500001 .500001 .866025 -407.972 -90.55)">
					<path
						d="M-164.126 43.978H-62.564L-11.784-43.978H-113.346L-164.126 43.978Z"
						fill="#FF7A2C"
					/>
				</g>
				<g transform="translate(-430.697 -26.65)">
					<path
						d="M0-32.449V0L-59.853 34.556-147.808-16.224-59.853-67.005 0-32.449Z"
						fill="#48E2CE"
					/>
				</g>
				<g transform="matrix(.866025 .500001 .500001 -.866025 -538.174 -48.341)">
					<path d="M-32.194-32.194H69.368L120.149-120.149H18.587L-32.194-32.194Z" fill="#50C4B6" />
				</g>
				<g transform="translate(-423.403 191.213)">
					<path
						d="M0-103.668L28.104-119.893 87.955-85.336V16.225L0-34.556V-103.668Z"
						fill="#FF9E00"
					/>
				</g>
				<g transform="matrix(0 -1 -1 0 -207.96 175.287)">
					<path d="M-32.151 120.195H69.411L120.195 32.233H18.681L-32.151 120.195Z" fill="#F78600" />
				</g>
			</g>
		</svg>
		<div style={{ display: "flex", flexDirection: "column" }}>
			<span
				style={{
					transform: "translateY(-2px)",
					fontSize: "28px",
					fontWeight: 600,
					textTransform: "lowercase",
					color: TEXT_PRIMARY,
					letterSpacing: "0.01em",
				}}
			>
				{siteConfig.title}
			</span>
		</div>
	</div>
);
