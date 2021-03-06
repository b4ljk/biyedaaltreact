import React from "react";
import { NavLink as Link, useLocation } from "react-router-dom";
import { Button } from "@chakra-ui/react";

export default function Navlink({ to, name, ...rest }) {
  const location = useLocation();

  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Button
        fontFamily={"heading"}
        fontSize="xl"
        fontWeight={"bold"}
        variant={isActive ? "outline" : "ghost"}
        colorScheme={isActive ? "pink" : ""}
        {...rest}
        // fontSize="xl"
      >
        {name}
      </Button>
    </Link>
  );
}
